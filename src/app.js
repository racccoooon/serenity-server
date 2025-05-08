import Fastify from 'fastify';
import {logger} from './utils/logger.js';
import {config} from './config/settings.js';
import {routes} from './routes/index.js';
import {runMigrations} from "./db/index.js";
import {serializerCompiler, validatorCompiler} from "fastify-zod-openapi";
import {Container} from "./container/index.js";
import {UserDomainService} from "./services/userDomainService.js";
import {UserRepository} from "./repositories/userRepository.js";
import {UserAuthRepository} from "./repositories/userAuthRepository.js";
import {Mediator} from "./mediator/index.js";
import {RegisterUserCommand, RegisterUserHandler} from "./commands/auth/registerUser.js";

const fastify = Fastify({logger: false});

// Register routes
fastify.register(routes);

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

export const container = new Container();

container.registerTransient(UserDomainService, (c) => new UserDomainService({
    userRepository: c.resolve(UserRepository),
    userAuthRepository: c.resolve(UserAuthRepository),
}));

container.registerTransient(UserRepository, () => new UserRepository());
container.registerTransient(UserAuthRepository, () => new UserAuthRepository());

container.registerTransient(RegisterUserHandler, (c) => new RegisterUserHandler(
    c.resolve(UserDomainService),
));

export const mediator = new Mediator();

mediator.register(RegisterUserCommand, () => container.resolve(RegisterUserHandler));

// Start the server
const start = async () => {
    try {
        await runMigrations();

        await fastify.listen(config.server);
        logger.info(`Server is running on http://localhost:${config.server.port}`);
    } catch (err) {
        logger.error('Error starting server:', err);
        process.exit(1);
    }
};

await start();