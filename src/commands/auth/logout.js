import {SessionId} from "../../domain/session.js";

export class LogoutCommand {
    constructor(sessionId) {
        if (!(sessionId instanceof SessionId)) throw new Error("Session id has to be a SessionId");
        this.sessionId = sessionId;
    }
}

export class LogoutHandler {
    constructor(authDomainService) {
        this.authDomainService = authDomainService;
    }

    /**
     * @param {LogoutCommand} command
     * @returns {Promise<void>}
     */
    async handle(command) {
        if (!command) throw new Error('Command must be provided');

        await this.authDomainService.logout(command.sessionId);
    }
}