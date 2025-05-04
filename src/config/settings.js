require('dotenv').config();

module.exports = {
  logLevel: process.env.LOG_LEVEL || 'info',
  server: {
    port: process.env.PORT || 5680,
    host: process.env.HOST || '0.0.0.0'
  }
};