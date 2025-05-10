import {Client} from 'pg';
import pg from 'pg';
import {migrate} from 'postgres-migrations';
import {config} from '../config/settings.js';
import {logger} from '../utils/logger.js';

const {Pool} = pg;

export const pool = new Pool(config.db);

// Add error handling for the pool
pool.on('error', (err) => {
    logger.error('Unexpected error on idle client', err);
});

const dbConfig = {
    ...config.db,
};

export async function runMigrations() {
    try {
        // Run migrations
        await migrate(dbConfig, './src/db/migrations');

        logger.info('Migrations completed successfully.');
    } catch (err) {
        logger.error('Migration failed:', err);
        throw err;
    }
}

// @ts-check

/**
 * Manages a PostgreSQL transaction with automatic commit/rollback.
 */
export class DbTransaction {
    /**
     * @type {Client | null}
     */
    #client = null;

    /**
     * @type {Boolean}
     */
    #ended = false;

    /**
     * Starts a transaction (if there isn't one already) and returns the client.
     * @returns {Promise<Client>}
     */
    async tx() {
        if (this.#ended) throw new Error("Transaction has ended.");

        if (!this.#client) {
            this.#client = await pool.connect();
            await this.#client.query('BEGIN');
        }

        return this.#client;
    }

    async rollback() {
        if (!this.#client) return;

        this.#ended = true;

        try {
            await this.#client.query('ROLLBACK');
        } catch (e) {
            logger.error('Failed to rollback transaction: ', e);
        }
    }

    /**
     * Commits the transaction if possible, otherwise rolls back.
     * Always releases the client.
     * @returns {Promise<void>}
     */
    async dispose() {
        if (!this.#client) return;

        try {
            if (!this.#ended) {
                this.#ended = true;
                await this.#client.query('COMMIT');
            }
        } finally {
            this.#client.release();
            this.#client = null;
        }
    }
}
