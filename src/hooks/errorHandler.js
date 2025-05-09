import {logger} from "../utils/logger.js";
import {AuthorizationError} from "../commands/auth/passwordLogin.js";

export default function errorHandler(error, request, reply) {
    if (error instanceof AuthorizationError) {
        return reply.code(401).send();
    }

    // Catch-all fallback
    logger.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
}
