import {ChannelFilter} from "../../repositories/channelRepository.js";

export class GetChannelsInServerQuery{
    constructor(serverId) {
        this.serverId = serverId;
    }
}

export class GetChannelsInServerHandler{
    constructor(channelRepository) {
        this.channelRepository = channelRepository;
    }

    async handle(query){
        return await this.channelRepository.list(new ChannelFilter()
            .whereServer(query.serverId));
    }
}