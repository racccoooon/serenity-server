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
container.registerTransient(ChannelRepository, (c) => new ChannelRepository(c.resolve(DbTransaction)));

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
));
container.registerTransient(GetServersOfUserHandler, (c) => new GetServersOfUserHandler(
    c.resolve(ServerRepository),
));

container.registerTransient(CreateChannelHandler, (c) => new CreateChannelHandler(
    c.resolve(ChannelRepository),
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

const mediatorBuilder = new MediatorBuilder();

mediatorBuilder.register(RegisterUserCommand, (c) =>  c.resolve(RegisterUserHandler));
mediatorBuilder.register(PasswordLoginCommand, (c) => c.resolve(PasswordLoginHandler));
mediatorBuilder.register(LogoutCommand, (c) => c.resolve(LogoutHandler));
mediatorBuilder.register(CreatePublicTokenCommand, (c) => c.resolve(CreatePublicTokenHandler));

mediatorBuilder.register(CreateServerCommand, (c) => c.resolve(CreateServerHandler));
mediatorBuilder.register(GetServersOfUserQuery, (c) => c.resolve(GetServersOfUserHandler));

mediatorBuilder.register(CreateChannelCommand, (c) => c.resolve(CreateChannelHandler));

mediatorBuilder.register(GetPublicUserProfileQuery, (c) => c.resolve(GetPublicUserProfileHandler));

mediatorBuilder.register(CreateInviteCommand, (c) => c.resolve(CreateInviteHandler));
mediatorBuilder.register(GetServerInvitesQuery, (c) => c.resolve(GetServerInvitesHandler));

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
