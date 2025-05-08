import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
import {RegisterUserCommand} from "../commands/users/registerUser.js";
import {mediator} from "../app.js";
import {status} from "http-status";

extendZodWithOpenApi(z);

const userRegisterSchema = z.object({
    username: z.string().openapi({
        description: 'Username of the user that is registering.',
        example: 'bean27'
    }),
    email: z.string(),
    authenticationMethods: z.array(z.discriminatedUnion("type", [
            z.object({
                type: z.literal('password'),
                details: z.object({
                    password: z.string(),
                })
            })
        ])
    ).nonempty()
});

export async function registerUser(fastify) {
    fastify.post('/api/v1/users/register', {
        schema: {
            body: userRegisterSchema,
        },
    }, async (request, reply) => {
        const requestDto = request.body;

        await mediator.send(new RegisterUserCommand(
            requestDto.username,
            requestDto.email,
            requestDto.authenticationMethods));

        reply.code(status.NO_CONTENT);
    });
}
