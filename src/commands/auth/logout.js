import {SessionFilter} from "../../repositories/sessionRepository.js";

export class LogoutCommand {
    constructor(sessionId) {
        this.sessionId = sessionId;
    }
}

export class LogoutHandler {
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    /**
     * @param {LogoutCommand} command
     * @returns {Promise<void>}
     */
    async handle(command) {
        if (!command) throw new Error('Command must be provided');

        await this.sessionRepository.remove(new SessionFilter()
            .whereId(command.sessionId));
    }
}