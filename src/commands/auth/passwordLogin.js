export class PasswordLoginCommand {
    constructor(userSelector) {
        this.userSelector = userSelector;
    }
}

export class AuthorizationError extends Error{}

export class PasswordLoginHandler {
    constructor(userDomainService) {
        this.userDomainService = userDomainService;
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
    }
}