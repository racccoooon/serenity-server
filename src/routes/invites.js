import {z} from 'zod';
import {DateTime} from "luxon";
import {authenticateEntity} from "./_httpAuth.js";
import {AuthError} from "../errors/authError.js";
import {status} from "http-status";
import {Mediator} from "../mediator/index.js";
import {CreateInviteCommand} from "../commands/invite/createInvite.js";

const createInviteSchema = z.object({
    validUntil: z.string().datetime().optional().transform(x => x ? DateTime.fromISO(x) : null),
});

export function createInvite(fastify) {
    fastify.post('/api/v1/servers/:serverId/invites', {
        schema: {
            body: createInviteSchema,
        }
    }, async (request, reply) => {
        const entity = await authenticateEntity(request);
        if (!entity.isUser()) throw new AuthError();

        const requestDto = request.body;

        const invite = await request.scope.resolve(Mediator)
            .send(new CreateInviteCommand(
                entity.id,
                requestDto.validUntil,
            ));

        reply.code(status.OK).send({id: invite.id});
    });
}