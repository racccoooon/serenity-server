import { logger } from '../utils/logger.js';
import { registerUser } from './users.js';

export async function routes(fastify, options) {
  fastify.get('/api/health', async (request, reply) => {
    logger.debug('Health check requested');
    return { status: 'ok' };
  });

  await registerUser(fastify);
}