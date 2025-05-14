import {z} from "zod";
import {authenticateEntity} from "./_httpAuth.js";
import {AuthError} from "../errors/authError.js";
import {Mediator} from "../mediator/index.js";
import {CreateChannelCommand} from "../commands/channel/createChannel.js";
import {status} from "http-status";
import {GetChannelsInServerQuery} from "../queries/channels/getChannelsInServer.js";
import {CreateChannelGroupCommand} from "../commands/channelGroup/createChannelGroup.js";
import {GetChannelGroupsInServerQuery} from "../queries/channelGroup/getChannelGroupsInServer.js";
import {UpdateChannelGroupCommand} from "../commands/channelGroup/updateChannelGroup.js";

const createChannelGroupSchema = z.object({
    name: z.string().max(63).nonempty(),
});

export function createChannelGroup(fastify) {
    fastify.post('/api/v1/servers/:serverId/channel-groups', {
        schema: {
            body: createChannelGroupSchema,
        }
    }, async (request, reply) => {
        const entity = await authenticateEntity(request);
        if (!entity.isUser()) throw new AuthError();

        const requestDto = request.body;

        const channelGroup = await request.scope.resolve(Mediator)
            .send(new CreateChannelGroupCommand(
                request.params.serverId,
                requestDto.name,
            ));

        reply.code(status.OK).send({id: channelGroup.id});
    });
}

const updateChannelGroupSchema = z.object({
    name: z.string().max(64).nonempty().optional(),
});

export function updateChannelGroup(fastify) {
    fastify.patch('/api/v1/servers/:serverId/channel-groups/:groupId', {
        schema: {
            body: updateChannelGroupSchema,
        }
    }, async (request, reply) => {
        const entity = await authenticateEntity(request);
        if (!entity.isUser()) throw new AuthError();

        const requestDto = request.body;

        const channelGroup = await request.scope.resolve(Mediator)
            .send(new UpdateChannelGroupCommand(
                request.params.groupId,
                requestDto.name,
            ))
    });
}

export function getChannelGroupsInServer(fastify) {
    fastify.get('/api/v1/servers/:serverId/channel-groups',
        async (request, reply) => {
            const entity = await authenticateEntity(request);
            if (!entity.isUser()) throw new AuthError();

            const response = await request.scope.resolve(Mediator)
                .send(new GetChannelGroupsInServerQuery(
                    request.params.serverId,
                ));

            reply.send(response);
        });
}

const createChannelSchema = z.object({
    name: z.string().max(63).nonempty(),
    groupId: z.string().uuid(),
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
                requestDto.groupId,
                requestDto.name,
            ));

        reply.code(status.OK).send({id: channel.id});
    });
}

export function getChannelsInServer(fastify) {
    fastify.get('/api/v1/servers/:serverId/channels',
        async (request, reply) => {
            const entity = await authenticateEntity(request);
            if (!entity.isUser()) throw new AuthError();

            const response = await request.scope.resolve(Mediator)
                .send(new GetChannelsInServerQuery(
                    request.params.serverId,
                ));

            reply.send(response);
        });
}