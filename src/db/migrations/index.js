import { migrate } from 'postgres-migrations';
import { config } from '/src/config/settings.js';
import { logger } from '/src/utils/logger.js';

const dbConfig = {
    ...config.db,
    // postgres-migrations needs defaultDatabase for initial creation
    defaultDatabase: 'postgres'
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

export { runMigrations };