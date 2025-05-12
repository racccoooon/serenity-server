import 'dotenv/config';

export const config = {
    server: {
        port: process.env.PORT || 5680,
        host: process.env.HOST || '0.0.0.0',
        domain: process.env.DOMAIN || 'localhost:5680',
    },
    db: {
        user: process.env.POSTGRES_USER || 'user',
        password: process.env.POSTGRES_PASSWORD || 'password',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT || 7891,
        database: process.env.POSTGRES_DB || 'serenity'
    },
    logLevel: process.env.LOG_LEVEL || 'info',
    logPii: process.env.LOG_PII || true,
    environment: process.env.ENVIRONMENT || 'Development',
    keyPair: {
        privateKeyPath: process.env.PRIV_KEY_PATH || './private.pem',
        pubKeyPath: process.env.PUB_KEY_PATH || './public.pem',
    },
};