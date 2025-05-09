import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
import {RegisterUserCommand} from "../commands/auth/registerUser.js";
import {mediator} from "../app.js";
import {status} from "http-status";
import {PasswordLoginCommand} from "../commands/auth/passwordLogin.js";

extendZodWithOpenApi(z);

const userRegisterSchema = z.object({
    username: z.string().nonempty().openapi({
        description: 'Username of the user that is registering.',
        example: 'bean27'
    }),
    email: z.string().nonempty(),
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
    fastify.post('/api/v1/auth/register', {
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


const loginSchema = z.object({
    username: z.string().nonempty(),
    password: z.string().nonempty(),
});

export async function passwordLogin(fastify) {
    fastify.post('/api/v1/auth/login', {
        schema: {
            body: loginSchema,
        },
    }, async (request, reply) => {
        const requestDto = request.body;

        const response = await mediator.send(new PasswordLoginCommand(
            requestDto.username,
            requestDto.password));

        reply.body= response;
    })
}