import Fastify from 'fastify';
import {logger} from './utils/logger.js';
import {config} from './config/settings.js';
import {routes} from './routes/index.js';
import {runMigrations} from "./db/index.js";
import {initializeMediator} from './mediator/instance.js'
import {serializerCompiler, validatorCompiler} from "fastify-zod-openapi";
import {Container} from "container";
import {UserDomainService} from "./services/userDomainService.js";
import {UserRepository} from "./repositories/userRepository.js";
import {UserAuthRepository} from "./repositories/userAuthRepository.js";

const fastify = Fastify({logger: false});

// Register routes
fastify.register(routes);

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

export const container = new Container();

container.registerSingleton(UserDomainService, (c) => new UserDomainService({
    userRepository: c.resolve(UserRepository),
    userAuthRepository: c.resolve(UserAuthRepository),
}));

container.registerSingleton(UserRepository, () => new UserRepository());
container.registerSingleton(UserAuthRepository, () => new UserAuthRepository());

// Start the server
const start = async () => {
    try {
        await runMigrations();
        initializeMediator()

        await fastify.listen(config.server);
        logger.info(`Server is running on http://localhost:${config.server.port}`);
    } catch (err) {
        logger.error('Error starting server:', err);
        process.exit(1);
    }
};

await start();