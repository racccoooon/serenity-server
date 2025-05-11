import {UserId} from "../../domain/user.js";
import {ServerMemberFilter} from "../../repositories/serverMemberRepository.js";
import {ServerFilter} from "../../repositories/serverRepository.js";

export class GetServersOfUserQuery{
    constructor(userId) {
        this.userId = userId;
    }
}

export class GetServersOfUserHandler{
    constructor(serverRepository) {
        this.serverRepository = serverRepository;
    }

    /**
     * @param {GetServersOfUserQuery} command
     * @returns {Promise<void>}
     */
    async handle(command) {
        if(!command) throw new Error('Command must be provided');

        const res = await this.serverRepository.list(new ServerFilter()
            .whereIsMember(command.userId));
        console.log(res)
        return res;
    }
}