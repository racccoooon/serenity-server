import {LexoRank} from "lexorank";
import {v4} from "uuid";

export class CreateChannelGroupCommand{
    constructor(serverId, name) {
        this.serverId = serverId;
        this.name = name;
    }
}

export class CreateChannelGroupHandler{
    constructor(channelGroupRepository) {
        this.channelGroupRepository = channelGroupRepository;
    }

    async handle(command){
        const biggestRank = await this.channelGroupRepository.getBiggestRank(command.serverId);
        const lexoRank = (biggestRank !== null)
            ? LexoRank.parse(biggestRank).genNext().toString()
            : LexoRank.min().toString();

        const channelGroup = {
            id: v4(),
            serverId: command.serverId,
            name: command.name,
            rank: lexoRank,
        };

        await this.channelGroupRepository.add(channelGroup);

        return channelGroup;
    }
}