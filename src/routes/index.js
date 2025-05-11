import { logger } from '../utils/logger.js';
import {logout, makePublicToken, passwordLogin, registerUser} from './auth.js';
import {createServer} from "./servers.js";
import {getPublicKey} from "./wellKnown.js";

export function routes(fastify, options) {
  fastify.get('/api/health', async (request, reply) => {
    logger.debug('Health check requested');
    return { status: 'ok' };
  });

  // well known routes
  getPublicKey(fastify);

  // auth routes
  registerUser(fastify);
  passwordLogin(fastify);
  logout(fastify);
  makePublicToken(fastify);

  // server routes
  createServer(fastify);
}