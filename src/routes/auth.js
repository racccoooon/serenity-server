import {z} from 'zod';
import {extendZodWithOpenApi} from 'zod-openapi';
import {RegisterUserCommand} from "../commands/auth/registerUser.js";
import {container, mediator} from "../app.js";
import {status} from "http-status";
import { PasswordLoginCommand} from "../commands/auth/passwordLogin.js";
import {AuthorizationError} from "../errors/authorizationError.js";
import {stringify} from "uuid";
import {SessionRepository} from "../repositories/sessionRepository.js";
import {createHash} from "crypto";
import {authenticateEntity} from "./_httpAuth.js";
import {CreatePublicTokenCommand} from "../commands/auth/createPublicToken.js";

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

        reply.header('authorization', `Bearer ${response.sessionToken}`);
        reply.code(status.NO_CONTENT);
    })
}

const makePublicTokenSchema = z.object({
    publicKey: z.string().nonempty(),
});

export async function makePublicToken(fastify) {
    fastify.post('/api/v1/auth/publicToken', {
        schema: {
            body: makePublicTokenSchema,
        },
    }, async (request, reply) => {
        const entity = await authenticateEntity(request.headers);
        if(!entity.isLocalUser()) throw new AuthorizationError();

        const requestDto = request.body;

        const response = await mediator.send(new CreatePublicTokenCommand(
            entity.id,
            requestDto.publicKey));

        reply.code(status.OK).send({
            jwt: response.jwt,
        });
    });
}
