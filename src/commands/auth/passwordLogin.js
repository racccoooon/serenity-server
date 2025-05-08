import {SessionToken} from "../../domain/session.js";

export class PasswordLoginCommand {
    constructor(userSelector, password) {
        this.userSelector = userSelector;
        this.password = password;
    }
}

export class LoginResponse {
    constructor(sessionToken) {
        this.sessionToken = sessionToken;
    }
}

export class AuthorizationError extends Error{}

export class PasswordLoginHandler {
    constructor(userDomainService, authDomainService) {
        this.userDomainService = userDomainService;
        this.authDomainService = authDomainService;
    }

    /**
     * @param command PasswordLoginCommand
     */
    handle = async(command) => {
        if (!command) throw new Error('Command must be provided');

        const user = this.userDomainService.findUser(command.userSelector);
        if(!user){
            throw new AuthorizationError();
        }

        let sessionToken = this.authDomainService.tryPasswordLogin(user, command.password);
        if (!sessionToken) {
            throw new AuthorizationError();
        }

        return new LoginResponse(sessionToken);
    }
}