require('dotenv').config();

module.exports = {
  logLevel: process.env.LOG_LEVEL || 'info',
};