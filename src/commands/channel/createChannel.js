import {v4} from "uuid";
import {LexoRank} from "lexorank";

export class CreateChannelCommand {
    constructor(serverId, name, group) {
        this.serverId = serverId;
        this.name = name;
        this.group = group;
    }
}

export class CreateChannelResponse {
    constructor(id) {
        this.id = id;
    }
}

export class CreateChannelHandler {
    constructor(channelRepository) {
        this.channelRepository = channelRepository;
    }

    async handle(command) {
        const biggestRank = await this.channelRepository.getBiggestRank(command.serverId, command.group);
        console.log("b: ", biggestRank);
        const lexoRank = (biggestRank !== null)
            ? LexoRank.parse(biggestRank).genNext().toString()
            : LexoRank.min().toString();

        const channel = {
            id: v4(),
            serverId: command.serverId,
            name: command.name,
            group: command.group,
            rank: lexoRank,
        };

        await this.channelRepository.add(channel);

        return new CreateChannelResponse(channel.id);
    }
}