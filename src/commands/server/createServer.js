import {Server} from "../../domain/server.js";
import {UserId} from "../../domain/user.js";
import {v4} from "uuid";

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
    constructor(serverDomainService, serverMemberRepository) {
        this.serverDomainService = serverDomainService;
        this.serverMemberRepository = serverMemberRepository;
    }

    /**
     * @param {CreateServerCommand} command
     * @returns {Promise<CreateServerResponse>}
     */
    async handle(command) {
        if (!command) throw new Error('Command must be provided');

        const server = new Server(command.ownerId, command.name, command.description);

        await this.serverDomainService.createServer(server);
        await this.serverMemberRepository.add({
            id: v4(),
            userId: command.ownerId.value,
            serverId: server.id.value,
        })

        return new CreateServerResponse(server.id);
    }
}