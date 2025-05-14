import {ChannelGroupFilter} from "../../repositories/channelGroupRepository.js";
import {HttpError} from "../../errors/httpError.js";
import {status} from "http-status";
import {ChannelFilter} from "../../repositories/channelRepository.js";
import {LexoRank} from "lexorank";

export class DeleteChannelGroupCommand {
    constructor(serverId, groupId) {
        this.serverId = serverId;
        this.groupId = groupId;
    }
}

export class DeleteChannelGroupHandler {
    constructor(channelGroupRepository, channelRepository) {
        this.channelGroupRepository = channelGroupRepository;
        this.channelRepository = channelRepository;
    }

    async handle(command) {
        const group = await this.channelGroupRepository.first(new ChannelGroupFilter()
            .whereId(command.groupId));

        if (group.isDefault) {
            throw new HttpError(status.BAD_REQUEST, "cannot delete default channel group");
        }

        const channels = await this.channelRepository.list(new ChannelFilter()
            .whereChannelGroup(command.groupId));

        if (channels.length > 0) {
            const defaultGroup = await this.channelGroupRepository.first(new ChannelGroupFilter()
                .whereServer(command.serverId)
                .whereIsDefault()
                .orderByRank());

            const biggestRank = await this.channelRepository.getBiggestRank(defaultGroup.Id);
            let lexoRank = biggestRank ? LexoRank.parse(biggestRank) : LexoRank.min();

            for (const channel of channels) {
                lexoRank = lexoRank.genNext();
                await this.channelRepository.update({
                    id: channel.id,
                    groupId: defaultGroup.id,
                    rank: lexoRank.toString(),
                });
            }
        }

        await this.channelGroupRepository.remove(new ChannelGroupFilter()
            .whereId(command.groupId));
    }
}