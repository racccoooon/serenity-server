import {AuthError} from "../errors/authError.js";
import {logger} from "../utils/logger.js";
import {DbTransaction} from "../db/index.js";

export default async function errorHandler(error, request, reply) {
    // we roll back any potential existing transaction
    const dbTransaction = request.scope.resolve(DbTransaction);
    await dbTransaction.rollback();

    if (error instanceof AuthError) {
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
