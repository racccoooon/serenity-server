export class UpdateChannelGroupCommand{
    constructor(groupId, name) {
        this.groupId = groupId;
        this.name = name;
    }
}

export class UpdateChannelGroupHandler {
    constructor(channelGroupRepository) {
        this.channelGroupRepository = channelGroupRepository;
    }

    async handle(command) {
        await this.channelGroupRepository.update({
            id: command.groupId,
            name: command.name,
        });
    }
}