import {z} from 'zod';
import {status} from "http-status";
import {CreateServerCommand} from "../commands/server/createServer.js";
import {container, mediator} from "../app.js";
import {AuthDomainService} from "../services/authDomainService.js";
import {UserId} from "../domain/user.js";

const createServerSchema = z.object({
    name: z.string().nonempty().max(63),
    description: z.string().max(255),
});

class CreateServerResponse {
    constructor(id) {
        this.id = id;
    }
}

export async function createServer(fastify) {
    fastify.post('/api/v1/servers', {
        schema: {
            body: createServerSchema,
        },
    }, async (request, reply) => {
        // TODO: validate session and make sure the user is from this server

        const requestDto = request.body;

        const response = await mediator.send(new CreateServerCommand(
            new UserId('7a8ac779-1b95-4f5c-987b-f5634b43b0fd'), //TODO: get current user id and not use this hardcoded id
            requestDto.name,
            requestDto?.description
        ));

        reply.code(status.OK)
            .send(new CreateServerResponse(response.id.value));
    });
}