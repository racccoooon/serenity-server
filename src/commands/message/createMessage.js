import {v4} from "uuid";

export class CreateMessageCommand {
    constructor(channelId, userId, type, details) {
        this.channelId = channelId;
        this.userId = userId;
        this.type = type;
        this.details = details;
    }
}

export class CreateMessageHandler{
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }

    async handle(command) {
        const message = {
            id: v4(),
            channelId: command.channelId,
            userId: command.userId,
            type: command.type,
            details: command.details,
        };

        await this.messageRepository.add(message);

        return message;
    }
}