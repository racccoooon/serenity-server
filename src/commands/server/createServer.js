import {Server} from "../../domain/server.js";
import {UserId} from "../../domain/user.js";

export class CreateServerCommand {
    constructor(ownerId, name, description) {
        this.ownerId = ownerId;
        this.name = name;
        this.description = description;
    }
}

export class CreateServerResponse{
    constructor(id) {
        this.id = id;
    }
}

export class CreateServerHandler {
    constructor(serverDomainService) {
        this.serverDomainService = serverDomainService;
    }

    /**
     * @param {CreateServerCommand} command
     * @returns {Promise<CreateServerResponse>}
     */
    async handle(command) {
        if (!command) throw new Error('Command must be provided');

        const server = new Server(command.ownerId, command.name, command.description);

        await this.serverDomainService.createServer(server);

        return new CreateServerResponse(server.id);
    }
}