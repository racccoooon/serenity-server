import { PUBLIC_KEY, loadKeyPair } from "../utils/crypto.js";

export async function getPublicKey(fastify) {
    // Ensure the key pair is loaded before setting up the route
    await loadKeyPair();

    fastify.get('/.well-known/serenity/pubkey', async (request, reply) => {
        // Respond with the public key as PEM formatted data
        console.log(PUBLIC_KEY); // You can log it to debug

        reply.send(PUBLIC_KEY.export({ type: 'spki', format: 'pem' }));
    });
}
