const logger = require('./utils/logger');

// Test our logger
logger.info('Application starting up...');
logger.debug('Debug message');
logger.error('This is an error message', { someExtra: 'This is metadata' });

