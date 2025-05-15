import {v4} from "uuid";
import {MessageCreatedEvent} from "../../eventing/events/messages/created/messageCreated.js";

export class CreateMessageCommand {
    constructor(serverId, channelId, userId, type, details) {
        this.serverId = serverId,
        this.channelId = channelId;
        this.userId = userId;
        this.type = type;
        this.details = details;
    }
}

export class CreateMessageHandler{
    constructor(messageRepository, eventService) {
        this.messageRepository = messageRepository;
        this.eventService = eventService;
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

        await this.eventService.publish(new MessageCreatedEvent({
            serverId: command.serverId,
            message: message,
        }));

        return message;
    }
}