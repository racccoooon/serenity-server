import {InviteFilter} from "../../repositories/inviteRepository.js";

export class GetServerInvitesQuery{
    constructor(serverId) {
        this.serverId = serverId;
    }
}

export class GetServerInvitesHandler {
    constructor(inviteRepository) {
        this.inviteRepository = inviteRepository;
    }

    async handle(query){
        return await this.inviteRepository.list(new InviteFilter()
            .whereServer(query.serverId));
    }
}