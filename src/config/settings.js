import 'dotenv/config';

export const config = {
  server: {
    port: process.env.PORT || 5680,
    host: process.env.HOST || '0.0.0.0'
  },
  logLevel: process.env.LOG_LEVEL || 'info'
};