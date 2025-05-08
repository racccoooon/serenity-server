export class PasswordLoginCommand {
    constructor(userSelector, password) {
        this.userSelector = userSelector;
        this.password = password;
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

        if (this.authDomainService.tryPasswordLogin(user, command.password) !== true){
            throw new AuthorizationError();
        }
    }
}