import {v4} from "uuid";

export class CreateInviteCommand {
    constructor(invitedById, validUntil) {
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
            invitedById: command.invitedById,
            validUntil: command.validUntil,
        };
        await this.inviteRepository.add(invite);
        return new CreateInviteResponse(invite.id);
    }
}