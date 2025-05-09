import {AuthorizationError} from "../errors/authorizationError.js";
import {logger} from "../utils/logger.js";

export default function errorHandler(error, request, reply) {
    if (error instanceof AuthorizationError) {
        return reply.code(401).send();
    }

    // validation error
    if(error.validation){
        const issues = [];
        for (let validationElement of error.validation) {
            const issue = validationElement.params.issue;
            issues.push(issue);
        }
        return reply.code(400).send({ error: "Bad Request", issues});
    }

    // Catch-all fallback
    logger.error(error.stack || error);
    return reply.code(500).send({ error: 'Internal Server Error' });
}
