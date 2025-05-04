import { logger } from '../utils/logger.js';

export async function routes(fastify, options) {
  // Health check endpoint
  fastify.get('/api/health', async (request, reply) => {
    logger.debug('Health check requested');
    return { status: 'ok' };
  });
}