import {ServerModel} from "../repositories/serverRepository.js";

export function createServerModel(server) {
    const model = new ServerModel();
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
}