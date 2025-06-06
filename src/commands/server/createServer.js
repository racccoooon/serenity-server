import {v4} from "uuid";
import {LexoRank} from "lexorank";

export class CreateServerCommand {
    constructor(ownerId, name, description) {
        this.ownerId = ownerId;
        this.name = name;
        this.description = description;
    }
}

export class CreateServerResponse {
    constructor(id) {
        this.id = id;
    }
}

export class CreateServerHandler {
    constructor(serverRepository, serverMemberRepository, channelGroupRepository) {
        this.serverRepository = serverRepository;
        this.serverMemberRepository = serverMemberRepository;
        this.channelGroupRepository = channelGroupRepository;
    }

    async handle(command) {
        if (!command) throw new Error('Command must be provided');

        const server = {
            id: v4(),
            ownerId: command.ownerId,
            name: command.name,
            description: command.description
        };

        await this.serverRepository.add(server);

        await this.channelGroupRepository.add({
            id: v4(),
            serverId: server.id,
            name: "",
            rank: LexoRank.min().toString(),
            isDefault: true,
        });

        await this.serverMemberRepository.add({
            id: v4(),
            userId: command.ownerId,
            serverId: server.id,
        });

        return new CreateServerResponse(server.id);
    }
}