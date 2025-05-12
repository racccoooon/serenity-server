import { logger } from '../utils/logger.js';
import {logout, makePublicToken, passwordLogin, registerUser} from './auth.js';
import {createServer, getJoinedServers} from "./servers.js";
import {getPublicKey} from "./wellKnown.js";
import {getPublicUserProfile} from "./users.js";
import {createInvite} from "./invites.js";

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
  getJoinedServers(fastify);

  // invite routes
  createInvite(fastify);

  // user routes
  getPublicUserProfile(fastify);
}