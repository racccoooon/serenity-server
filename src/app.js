import Fastify from 'fastify';
import {logger} from './utils/logger.js';
import {config} from './config/settings.js';
import {routes} from './routes/index.js';
import {DbTransaction, runMigrations} from "./db/index.js";
import {serializerCompiler, validatorCompiler} from "fastify-zod-openapi";
import {Container} from "./container/index.js";
import {UserRepository} from "./repositories/userRepository.js";
import {UserAuthRepository} from "./repositories/userAuthRepository.js";
import {Mediator, MediatorBuilder} from "./mediator/index.js";
import {RegisterUserCommand, RegisterUserHandler} from "./commands/auth/registerUser.js";
import {SessionRepository} from "./repositories/sessionRepository.js";
import {PasswordLoginCommand, PasswordLoginHandler} from "./commands/auth/passwordLogin.js";
import errorHandler from "./hooks/errorHandler.js";
import {CreateServerCommand, CreateServerHandler} from "./commands/server/createServer.js";
import {ServerRepository} from "./repositories/serverRepository.js";
import {loadKeyPair} from "./utils/crypto.js";
import {CreatePublicTokenCommand, CreatePublicTokenHandler} from "./commands/auth/createPublicToken.js";
import {perRequestScopeHook} from "./hooks/perRequestScope.js";
import {cleanupSessions} from "./crons/sessionCleanup.js";
import cron from 'node-cron';
import {LogoutCommand, LogoutHandler} from "./commands/auth/logout.js";
import {ServerMemberRepository} from "./repositories/serverMemberRepository.js";
import {GetServersOfUserHandler, GetServersOfUserQuery} from "./queries/servers/getServersOfUser.js";
import {GetPublicUserProfileHandler, GetPublicUserProfileQuery} from "./queries/users/getPublicUserProfile.js";
import {InviteRepository} from "./repositories/inviteRepository.js";
import {CreateInviteCommand, CreateInviteHandler} from "./commands/invite/createInvite.js";
import {GetServerInvitesHandler, GetServerInvitesQuery} from "./queries/invites/getInvitesOfServer.js";
import {CreateChannelCommand, CreateChannelHandler} from "./commands/channel/createChannel.js";
import {ChannelRepository} from "./repositories/channelRepository.js";
import {GetChannelsInServerHandler, GetChannelsInServerQuery} from "./queries/channels/getChannelsInServer.js";
import {ChannelGroupRepository} from "./repositories/channelGroupRepository.js";
import {CreateChannelGroupCommand, CreateChannelGroupHandler} from "./commands/channelGroup/createChannelGroup.js";
import {
    GetChannelGroupsInServerHandler,
    GetChannelGroupsInServerQuery
} from "./queries/channelGroup/getChannelGroupsInServer.js";
import {CreateMessageCommand, CreateMessageHandler} from "./commands/message/createMessage.js";
import {MessageRepository} from "./repositories/messageRepository.js";
import {UpdateChannelGroupCommand, UpdateChannelGroupHandler} from "./commands/channelGroup/updateChannelGroup.js";
import {JoinServerCommand, JoinServerHandler} from "./commands/invite/joinServer.js";
import {DeleteChannelGroupCommand, DeleteChannelGroupHandler} from "./commands/channelGroup/deleteChannelGroup.js";
import {EventService, InMemoryEventStrategy} from "./eventing/index.js";
import {MessageCreatedEvent} from "./eventing/events/messages/created/messageCreated.js";

const fastify = Fastify({logger: false});
// fall-back content type handler
fastify.addContentTypeParser('*', function (req, payload, done) {
    // pass empty object to request handler, ignoring body
    done(null, {})
})

// Register routes
fastify.setErrorHandler(errorHandler);
perRequestScopeHook(fastify)
fastify.register(routes);

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

export const container = new Container();

// db stuff
container.registerScoped(DbTransaction, () => {
    return new DbTransaction();
});

container.registerTransient(UserRepository, (c) => new UserRepository(c.resolve(DbTransaction)));
container.registerTransient(UserAuthRepository, (c) => new UserAuthRepository(c.resolve(DbTransaction)));
container.registerTransient(SessionRepository, (c) => new SessionRepository(c.resolve(DbTransaction)));
container.registerTransient(ServerRepository, (c) => new ServerRepository(c.resolve(DbTransaction)));
container.registerTransient(ServerMemberRepository, (c) => new ServerMemberRepository(c.resolve(DbTransaction)));
container.registerTransient(InviteRepository, (c) => new InviteRepository(c.resolve(DbTransaction)));
container.registerTransient(ChannelGroupRepository, (c) => new ChannelGroupRepository(c.resolve(DbTransaction)));
container.registerTransient(ChannelRepository, (c) => new ChannelRepository(c.resolve(DbTransaction)));
container.registerTransient(MessageRepository, (c) => new MessageRepository(c.resolve(DbTransaction)));

// commands and queries

container.registerTransient(RegisterUserHandler, (c) => new RegisterUserHandler(
    c.resolve(UserRepository),
    c.resolve(UserAuthRepository),
));
container.registerTransient(PasswordLoginHandler, (c) => new PasswordLoginHandler(
    c.resolve(UserRepository),
    c.resolve(UserAuthRepository),
    c.resolve(SessionRepository),
));
container.registerTransient(LogoutHandler, (c) => new LogoutHandler(
    c.resolve(SessionRepository),
));
container.registerTransient(CreatePublicTokenHandler, (c) => new CreatePublicTokenHandler(
    c.resolve(UserRepository),
));

container.registerTransient(CreateServerHandler, (c) => new CreateServerHandler(
    c.resolve(ServerRepository),
    c.resolve(ServerMemberRepository),
    c.resolve(ChannelGroupRepository),
));
container.registerTransient(GetServersOfUserHandler, (c) => new GetServersOfUserHandler(
    c.resolve(ServerRepository),
));

container.registerTransient(CreateChannelGroupHandler, (c) => new CreateChannelGroupHandler(
    c.resolve(ChannelGroupRepository),
));
container.registerTransient(UpdateChannelGroupHandler, (c) => new UpdateChannelGroupHandler(
    c.resolve(ChannelGroupRepository),
));
container.registerTransient(DeleteChannelGroupHandler, (c) => new DeleteChannelGroupHandler(
    c.resolve(ChannelGroupRepository),
    c.resolve(ChannelRepository),
));
container.registerTransient(GetChannelGroupsInServerHandler, (c) => new GetChannelGroupsInServerHandler(
    c.resolve(ChannelGroupRepository),
));

container.registerTransient(CreateChannelHandler, (c) => new CreateChannelHandler(
    c.resolve(ChannelGroupRepository),
    c.resolve(ChannelRepository),
));
container.registerTransient(GetChannelsInServerHandler, (c) => new GetChannelsInServerHandler(
    c.resolve(ChannelRepository),
));

container.registerTransient(CreateMessageHandler, (c) => new CreateMessageHandler(
    c.resolve(MessageRepository),
    c.resolve(EventService),
));

container.registerTransient(GetPublicUserProfileHandler, (c) => new GetPublicUserProfileHandler(
    c.resolve(UserRepository),
));

container.registerTransient(CreateInviteHandler, (c) => new CreateInviteHandler(
    c.resolve(InviteRepository),
));
container.registerTransient(GetServerInvitesHandler, (c) => new GetServerInvitesHandler(
    c.resolve(InviteRepository),
));
container.registerTransient(JoinServerHandler, (c) => new JoinServerHandler(
    c.resolve(InviteRepository),
    c.resolve(ServerMemberRepository),
));

// messaging
const eventService = new EventService(new InMemoryEventStrategy()); //TODO: switch based on config

eventService.on(MessageCreatedEvent, {
    handle: e => {
        console.log("received event: ", e);
    }
});

container.registerSingleton(EventService, eventService);

// mediator
const mediatorBuilder = new MediatorBuilder();

mediatorBuilder.register(RegisterUserCommand, (c) => c.resolve(RegisterUserHandler));
mediatorBuilder.register(PasswordLoginCommand, (c) => c.resolve(PasswordLoginHandler));
mediatorBuilder.register(LogoutCommand, (c) => c.resolve(LogoutHandler));
mediatorBuilder.register(CreatePublicTokenCommand, (c) => c.resolve(CreatePublicTokenHandler));

mediatorBuilder.register(CreateServerCommand, (c) => c.resolve(CreateServerHandler));
mediatorBuilder.register(GetServersOfUserQuery, (c) => c.resolve(GetServersOfUserHandler));

mediatorBuilder.register(CreateChannelGroupCommand, (c) => c.resolve(CreateChannelGroupHandler));
mediatorBuilder.register(UpdateChannelGroupCommand, (c) => c.resolve(UpdateChannelGroupHandler));
mediatorBuilder.register(DeleteChannelGroupCommand, (c) => c.resolve(DeleteChannelGroupHandler));
mediatorBuilder.register(GetChannelGroupsInServerQuery, (c) => c.resolve(GetChannelGroupsInServerHandler));

mediatorBuilder.register(CreateChannelCommand, (c) => c.resolve(CreateChannelHandler));
mediatorBuilder.register(GetChannelsInServerQuery, (c) => c.resolve(GetChannelsInServerHandler));

mediatorBuilder.register(CreateMessageCommand, (c) => c.resolve(CreateMessageHandler));

mediatorBuilder.register(GetPublicUserProfileQuery, (c) => c.resolve(GetPublicUserProfileHandler));

mediatorBuilder.register(CreateInviteCommand, (c) => c.resolve(CreateInviteHandler));
mediatorBuilder.register(GetServerInvitesQuery, (c) => c.resolve(GetServerInvitesHandler));
mediatorBuilder.register(JoinServerCommand, (c) => c.resolve(JoinServerHandler));

container.registerScoped(Mediator, (c) => mediatorBuilder.build(c));

// clean sessions every day at 00:00
cron.schedule('0 0 * * *', cleanupSessions);

// Start the server
const start = async () => {
    try {
        await loadKeyPair();
        await runMigrations();

        await fastify.listen(config.server);
        logger.info(`Server is running on http://localhost:${config.server.port}`);
    } catch (err) {
        logger.error('Error starting server:', err);
        process.exit(1);
    }
};

await start();
