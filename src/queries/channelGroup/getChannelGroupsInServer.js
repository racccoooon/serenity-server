import {ChannelGroupFilter} from "../../repositories/channelGroupRepository.js";

export class GetChannelGroupsInServerQuery{
    constructor(serverid) {
        this.serverId = serverid;
    }
}

export class GetChannelGroupsInServerHandler{
    constructor(channelGroupRepository) {
        this.channelGroupRepository = channelGroupRepository;
    }

    async handle(query){
        return await this.channelGroupRepository.list(new ChannelGroupFilter()
            .whereServer(query.serverId));
    }
}