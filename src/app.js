import Fastify from 'fastify';
import {logger} from './utils/logger.js';
import {config} from './config/settings.js';
import {routes} from './routes/index.js';
import {runMigrations} from "./db/index.js";
import {initializeMediator} from './mediator/instance.js'

const fastify = Fastify({logger: false});

// Register routes
fastify.register(routes);

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