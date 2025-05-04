const fastify = require('fastify')({ logger: false });
const logger = require('./utils/logger');
const config = require('./config/settings');
const routes = require('./routes');

// Register routes
fastify.register(routes);

// Start the server
const start = async () => {
  try {
    await fastify.listen(config.server);
    logger.info(`Server is running on http://localhost:${config.server.port}`);
  } catch (err) {
    logger.error('Error starting server:', err);
    process.exit(1);
  }
};

await start();