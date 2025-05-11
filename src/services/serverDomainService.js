
export function createServerModel(server) {
    const model = {};
    model.id = server.id.value;
    model.ownerId = server.ownerId.value;
    model.name = server.name;
    model.description = server.description;
    return model;
}

export class ServerDomainService{
    constructor({serverRepository}) {
        this.serverRepository = serverRepository;
    }

    /**
     * @param {import('../domain/server.js').Server} server
     * @returns {Promise<void>}
     */
    async createServer(server){
        await this.serverRepository.add(createServerModel(server))
    }

    /**
     * @param {import('../domain/user.js').UserId} userId
     * @returns {Promise<import('../domain/server.js').Server>}
     */
    async getServersOfUser(userId){
        return await this.serverRepository
            .whereUserId(userId)
            .toPaged();
    }
}