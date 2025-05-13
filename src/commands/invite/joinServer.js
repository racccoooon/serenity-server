import {InviteFilter} from "../../repositories/inviteRepository.js";
import {AuthError} from "../../errors/authError.js";
import {v4} from "uuid";
import {ServerMemberFilter} from "../../repositories/serverMemberRepository.js";
import {HttpError} from "../../errors/httpError.js";
import {status} from "http-status";

export class JoinServerCommand{
    constructor(serverId, inviteId, userId) {
        this.serverId = serverId;
        this.inviteId = inviteId;
        this.userId = userId;
    }
}

export class JoinServerHandler{
    constructor(inviteRepository, memberRepository) {
        this.inviteRepository = inviteRepository;
        this.memberRepository = memberRepository;
    }

    async handle(command) {
        const invite = await this.inviteRepository.first(new InviteFilter()
            .whereId(command.inviteId));

        if (!invite) {
            throw new AuthError();
        }

        const member = await this.memberRepository.first(new ServerMemberFilter()
            .whereUserId(command.userId)
            .whereServerId(command.serverId));
        if(member !== null){
            throw new HttpError(status.CONFLICT, 'already a server member');
        }

        this.memberRepository.add({
            id: v4(),
            userId: command.ownerId,
            serverId: command.serverId,
        });
    }
}