import {container} from "../app.js";

export function perRequestScopeHook(fastify) {
    // Hook to create a scope for each request
    fastify.addHook('onRequest', async (request, reply) => {
        // Create a new scope for this request
        // Attach the scope to the request object
        request.scope = container.createScope();
    });

    fastify.addHook('onResponse', async (request, reply) => {
        if (request.scope) {
            // Clean up or dispose the scope
            request.scope.dispose();
        }
    });
}