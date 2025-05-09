import { generateKeyPairSync, createPrivateKey, createPublicKey } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { config } from "../config/settings.js";
import { logger } from "./logger.js";

// These will hold the key objects
export let PRIVATE_KEY = null;
export let PUBLIC_KEY = null;

export async function loadKeyPair() {
    const privateExists = await fs.stat(config.keyPair.privateKeyPath).then(() => true).catch(() => false);
    const publicExists = await fs.stat(config.keyPair.pubKeyPath).then(() => true).catch(() => false);

    if (privateExists !== publicExists) {
        throw new Error('Inconsistent key state: one key file exists without the other.');
    }

    if (privateExists && publicExists) {
        const [privPem, pubPem] = await Promise.all([
            fs.readFile(config.keyPair.privateKeyPath, 'utf-8'),
            fs.readFile(config.keyPair.pubKeyPath, 'utf-8')
        ]);

        PRIVATE_KEY = createPrivateKey({ key: privPem, format: 'pem' });
        PUBLIC_KEY = createPublicKey({ key: pubPem, format: 'pem' });

        logger.info('Loaded existing Ed25519 key pair');
        return;
    }

    const { publicKey, privateKey } = generateKeyPairSync('ed25519');

    await fs.mkdir(path.dirname(config.keyPair.privateKeyPath), { recursive: true });

    await Promise.all([
        fs.writeFile(config.keyPair.privateKeyPath, privateKey.export({ type: 'pkcs8', format: 'pem' })),
        fs.writeFile(config.keyPair.pubKeyPath, publicKey.export({ type: 'spki', format: 'pem' })),
    ]);

    PRIVATE_KEY = privateKey;
    PUBLIC_KEY = publicKey;

    logger.info('New Ed25519 key pair generated and saved');
}
