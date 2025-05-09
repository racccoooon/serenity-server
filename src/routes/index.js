import { logger } from '../utils/logger.js';
import {passwordLogin, registerUser} from './auth.js';

export async function routes(fastify, options) {
  fastify.get('/api/health', async (request, reply) => {
    logger.debug('Health check requested');
    return { status: 'ok' };
  });

  // auth routes
  await registerUser(fastify);
  await passwordLogin(fastify);
}