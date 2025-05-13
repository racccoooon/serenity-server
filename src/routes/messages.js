import {z} from 'zod';
import {authenticateEntity} from "./_httpAuth.js";
import {AuthError} from "../errors/authError.js";
import {Mediator} from "../mediator/index.js";
import {CreateInviteCommand} from "../commands/invite/createInvite.js";
import {status} from "http-status";
import {CreateMessageCommand} from "../commands/message/createMessage.js";

const createMessageSchema = z.discriminatedUnion("type", [
        z.object({
            type: z.literal('text'),
            details: z.object({
                content: z.string().nonempty(),
            })
        })
    ]
);

export function createMessage(fastify){
    fastify.post('/api/v1/servers/:serverId/channels/:channelId/messages', {
        schema: {
            body: createMessageSchema,
        }
    }, async (request, reply) => {
        const entity = await authenticateEntity(request);
        if (!entity.isUser()) throw new AuthError();

        const requestDto = request.body;

        const invite = await request.scope.resolve(Mediator)
            .send(new CreateMessageCommand(
                request.params.channelId,
                entity.id,
                requestDto.type,
                requestDto.details,
            ));

        reply.code(status.OK).send({id: invite.id});
    });
}
