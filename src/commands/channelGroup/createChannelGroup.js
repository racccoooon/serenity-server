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
        const lexoRank = LexoRank.parse(biggestRank).genNext().toString();

        const channelGroup = {
            id: v4(),
            serverId: command.serverId,
            name: command.name,
            rank: lexoRank,
            isDefault: false,
        };

        await this.channelGroupRepository.add(channelGroup);

        return channelGroup;
    }
}