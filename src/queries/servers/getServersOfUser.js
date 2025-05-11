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

        return await this.serverRepository.list(new ServerFilter()
            .whereIsMember(command.userId));
    }
}