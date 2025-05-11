import {UserId} from "../../domain/user.js";

export class GetServersOfUserQuery{
    constructor(userId) {
        if(!(userId instanceof UserId)) throw new Error('UserId must be a UserId');
        this.userId = userId;
    }
}

export class GetServersOfUserHandler{
    constructor(serverDomainService) {
        this.serverDomainService = serverDomainService;
    }

    /**
     * @param {GetServersOfUserQuery} command
     * @returns {Promise<void>}
     */
    async handle(command) {
        if(!command) throw new Error('Command must be provided');

        return this.serverDomainService.getServersOfUser(command.userId);
    }
}