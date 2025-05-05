import pg from 'pg';
import { config } from '../config/settings.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

const pool = new Pool(config.db);

// Add error handling for the pool
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

export { pool };