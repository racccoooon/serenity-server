import { logger } from '../utils/logger.js';
import {logout, makePublicToken, passwordLogin, registerUser} from './auth.js';
import {createServer, getJoinedServers} from "./servers.js";
import {getPublicKey} from "./wellKnown.js";
import {getPublicUserProfile} from "./users.js";
import {createInvite, listServerInvites} from "./invites.js";
import {createChannel, getChannelsInServer} from "./channels.js";

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

  // channel routes
  createChannel(fastify);
  getChannelsInServer(fastify);

  // invite routes
  createInvite(fastify);
  listServerInvites(fastify);

  // user routes
  getPublicUserProfile(fastify);
}