import {v4} from "uuid";
import {LexoRank} from "lexorank";
import {ChannelGroupFilter} from "../../repositories/channelGroupRepository.js";
import {HttpError} from "../../errors/httpError.js";
import {HttpStatusCode} from "axios";

export class CreateChannelCommand {
    constructor(serverId, groupId, name) {
        this.serverId = serverId;
        this.groupId = groupId;
        this.name = name;
    }
}

export class CreateChannelHandler {
    constructor(channelGroupRepository, channelRepository) {
        this.channelGroupRepository = channelGroupRepository;
        this.channelRepository = channelRepository;
    }

    async handle(command) {
        const group = await this.channelGroupRepository.first(new ChannelGroupFilter()
            .whereId(command.groupId));
        if(group === null || group.serverId !== command.serverId){
            throw new HttpError(HttpStatusCode.NotFound, 'unknown channel group');
        }

        const biggestRank = await this.channelRepository.getBiggestRank(command.groupId);
        const lexoRank = (biggestRank !== null)
            ? LexoRank.parse(biggestRank).genNext().toString()
            : LexoRank.min().toString();

        const channel = {
            id: v4(),
            groupId: command.groupId,
            name: command.name,
            rank: lexoRank,
        };

        await this.channelRepository.add(channel);

        return channel;
    }
}