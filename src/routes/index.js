import { logger } from '../utils/logger.js';
import {logout, makePublicToken, passwordLogin, registerUser} from './auth.js';
import {createServer, getJoinedServers} from "./servers.js";
import {getPublicKey} from "./wellKnown.js";
import {getPublicUserProfile} from "./users.js";
import {createInvite, joinServer, listServerInvites} from "./invites.js";
import {
  createChannel,
  createChannelGroup,
  getChannelGroupsInServer,
  getChannelsInServer,
  updateChannelGroup
} from "./channels.js";
import {createMessage} from "./messages.js";

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
  createChannelGroup(fastify);
  updateChannelGroup(fastify);
  getChannelGroupsInServer(fastify);

  createChannel(fastify);
  getChannelsInServer(fastify);

  // message routes
  createMessage(fastify);

  // invite routes
  createInvite(fastify);
  listServerInvites(fastify);
  joinServer(fastify);

  // user routes
  getPublicUserProfile(fastify);
}