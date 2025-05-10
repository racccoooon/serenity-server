import Fastify from 'fastify';
import {logger} from './utils/logger.js';
import {config} from './config/settings.js';
import {routes} from './routes/index.js';
import {DbTransaction, runMigrations} from "./db/index.js";
import {serializerCompiler, validatorCompiler} from "fastify-zod-openapi";
import {Container} from "./container/index.js";
import {UserDomainService} from "./services/userDomainService.js";
import {UserRepository} from "./repositories/userRepository.js";
import {UserAuthRepository} from "./repositories/userAuthRepository.js";
import {Mediator} from "./mediator/index.js";
import {RegisterUserCommand, RegisterUserHandler} from "./commands/auth/registerUser.js";
import {SessionRepository} from "./repositories/sessionRepository.js";
import {AuthDomainService} from "./services/authDomainService.js";
import {PasswordLoginCommand, PasswordLoginHandler} from "./commands/auth/passwordLogin.js";
import errorHandler from "./hooks/errorHandler.js";
import {CreateServerCommand, CreateServerHandler} from "./commands/server/createServer.js";
import {ServerDomainService} from "./services/serverDomainService.js";
import {ServerRepository} from "./repositories/serverRepository.js";
import {loadKeyPair} from "./utils/crypto.js";
import {CreatePublicTokenCommand, CreatePublicTokenHandler} from "./commands/auth/createPublicToken.js";
import {perRequestScopeHook} from "./hooks/perRequestScope.js";

const fastify = Fastify({logger: false});

// Register routes
fastify.setErrorHandler(errorHandler);
perRequestScopeHook(fastify)
fastify.register(routes);

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

export const container = new Container();

container.registerTransient(UserDomainService, (c) => new UserDomainService({
    userRepository: c.resolve(UserRepository),
    userAuthRepository: c.resolve(UserAuthRepository),
}));
container.registerTransient(AuthDomainService, (c) => new AuthDomainService({
    sessionRepository: c.resolve(SessionRepository),
}));
container.registerTransient(ServerDomainService, (c) => new ServerDomainService({
    serverRepository: c.resolve(ServerRepository),
}));

container.registerScoped(DbTransaction, () => {
    return new DbTransaction();
});

container.registerTransient(UserRepository, () => new UserRepository());
container.registerTransient(UserAuthRepository, () => new UserAuthRepository());
container.registerTransient(SessionRepository, () => new SessionRepository());
container.registerTransient(ServerRepository, () => new ServerRepository());

container.registerTransient(RegisterUserHandler, (c) => new RegisterUserHandler(
    c.resolve(UserDomainService),
));
container.registerTransient(PasswordLoginHandler, (c) => new PasswordLoginHandler(
    c.resolve(UserDomainService),
    c.resolve(AuthDomainService),
));
container.registerTransient(CreatePublicTokenHandler, (c) => new CreatePublicTokenHandler(
    c.resolve(UserDomainService),
));

container.registerTransient(CreateServerHandler, (c) => new CreateServerHandler(
    c.resolve(ServerDomainService),
));

export const mediator = new Mediator();

mediator.register(RegisterUserCommand, () => container.resolve(RegisterUserHandler));
mediator.register(PasswordLoginCommand, () => container.resolve(PasswordLoginHandler));
mediator.register(CreatePublicTokenCommand, () => container.resolve(CreatePublicTokenHandler));

mediator.register(CreateServerCommand, () => container.resolve(CreateServerHandler));

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