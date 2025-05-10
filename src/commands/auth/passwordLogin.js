import {UserSelector} from "../../domain/user.js";
import {AuthError} from "../../errors/authError.js";

export class PasswordLoginCommand {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

export class LoginResponse {
    constructor(sessionToken) {
        this.sessionToken = sessionToken;
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

        console.log(command)
        const user = await this.userDomainService.findUser(UserSelector.from(command.username));
        if(!user){
            throw new AuthError();
        }

        let sessionToken = await this.authDomainService.tryPasswordLogin(user, command.password);
        if (!sessionToken) {
            throw new AuthError();
        }

        return new LoginResponse(sessionToken);
    }
}