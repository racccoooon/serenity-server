import {SessionToken} from "../../domain/session.js";
import {UserSelector} from "../../domain/user.js";

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

export class AuthorizationError extends Error{
    constructor() {
        super("Unauthorized");
    }
}

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

        const user = await this.userDomainService.findUser(UserSelector.from(command.userSelector));
        if(!user){
            throw new AuthorizationError();
        }

        let sessionToken = await this.authDomainService.tryPasswordLogin(user, command.password);
        if (!sessionToken) {
            throw new AuthorizationError();
        }

        return new LoginResponse(sessionToken);
    }
}