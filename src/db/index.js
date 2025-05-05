import pg from 'pg';
import { migrate } from 'postgres-migrations';
import { config } from '../config/settings.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

const pool = new Pool(config.db);

// Add error handling for the pool
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

const dbConfig = {
    ...config.db,
};

async function runMigrations() {
    try {
        // Run migrations
        await migrate(dbConfig, './src/db/migrations');

        logger.info('Migrations completed successfully.');
    } catch (err) {
        logger.error('Migration failed:', err);
        throw err;
    }
}

export { pool, runMigrations };