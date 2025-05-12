import {v4} from "uuid";
import {LexoRank} from "lexorank";

export class CreateChannelCommand {
    constructor(serverId, groupId, name) {
        this.serverId = serverId;
        this.groupId = groupId;
        this.name = name;
    }
}

export class CreateChannelHandler {
    constructor(channelRepository) {
        this.channelRepository = channelRepository;
    }

    async handle(command) {
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