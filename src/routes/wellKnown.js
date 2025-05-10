import { PUBLIC_KEY, loadKeyPair } from "../utils/crypto.js";

export function getPublicKey(fastify) {
    fastify.get('/.well-known/serenity/pubkey', async (request, reply) => {
        reply.send(PUBLIC_KEY.export({ type: 'spki', format: 'pem' }));
    });
}
