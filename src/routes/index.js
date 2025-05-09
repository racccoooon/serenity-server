import { logger } from '../utils/logger.js';
import {makePublicToken, passwordLogin, registerUser} from './auth.js';
import {createServer} from "./servers.js";
import {getPublicKey} from "./wellKnown.js";

export async function routes(fastify, options) {
  fastify.get('/api/health', async (request, reply) => {
    logger.debug('Health check requested');
    return { status: 'ok' };
  });

  // well known routes
  await getPublicKey(fastify);

  // auth routes
  await registerUser(fastify);
  await passwordLogin(fastify);
  await makePublicToken(fastify);

  // server routes
  await createServer(fastify);
}