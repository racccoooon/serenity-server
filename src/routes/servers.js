import {z} from 'zod';
import {status} from "http-status";
import {CreateServerCommand} from "../commands/server/createServer.js";
import {UserId} from "../domain/user.js";
import {authenticateEntity} from "./_httpAuth.js";
import {AuthError} from "../errors/authError.js";
import {Mediator} from "../mediator/index.js";

const createServerSchema = z.object({
    name: z.string().nonempty().max(63),
    description: z.string().max(255),
});

class CreateServerResponse {
    constructor(id) {
        this.id = id;
    }
}

export function createServer(fastify) {
    fastify.post('/api/v1/servers', {
        schema: {
            body: createServerSchema,
        },
    }, async (request, reply) => {
        const entity = await authenticateEntity(request);
        if (!entity.isLocalUser()) throw new AuthError();

        const requestDto = request.body;

        const response = await request.scope.resolve(Mediator)
            .send(new CreateServerCommand(
                entity.id,
                requestDto.name,
                requestDto?.description
            ));

        reply.code(status.OK)
            .send(new CreateServerResponse(response.id.value));
    });
}