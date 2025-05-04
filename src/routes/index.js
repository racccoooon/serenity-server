const logger = require('../utils/logger');

async function routes(fastify, options) {
  // Health check endpoint
  fastify.get('/api/health', async (request, reply) => {
    logger.debug('Health check requested');
    return { status: 'ok' };
  });
}

module.exports = routes;