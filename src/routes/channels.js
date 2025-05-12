import {z} from "zod";
import {authenticateEntity} from "./_httpAuth.js";
import {AuthError} from "../errors/authError.js";
import {Mediator} from "../mediator/index.js";
import {CreateChannelCommand} from "../commands/channel/createChannel.js";
import {status} from "http-status";

const createChannelSchema = z.object({
    name: z.string().max(63).nonempty(),
    group: z.string().max(63).optional(),
});

export function createChannel(fastify) {
    fastify.post('/api/v1/servers/:serverId/channels', {
        schema: {
            body: createChannelSchema,
        }
    }, async (request, reply) => {
        const entity = await authenticateEntity(request);
        if (!entity.isUser()) throw new AuthError();

        const requestDto = request.body;

        const channel = await request.scope.resolve(Mediator)
            .send(new CreateChannelCommand(
                request.params.serverId,
                requestDto.name,
                requestDto.group,
            ));

        reply.code(status.OK).send({id: channel.id});
    });
}