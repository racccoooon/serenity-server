import {v4} from "uuid";

export class CreateInviteCommand {
    constructor(serverId, invitedById, validUntil) {
        this.serverId = serverId;
        this.invitedById = invitedById;
        this.validUntil = validUntil;
    }
}

export class CreateInviteResponse {
    constructor(id) {
        this.id = id;
    }
}

export class CreateInviteHandler {
    constructor(inviteRepository) {
        this.inviteRepository = inviteRepository;
    }

    async handle(command) {
        const invite = {
            id: v4(),
            serverId: command.serverId,
            invitedById: command.invitedById,
            validUntil: command.validUntil,
        };
        await this.inviteRepository.add(invite);
        return new CreateInviteResponse(invite.id);
    }
}