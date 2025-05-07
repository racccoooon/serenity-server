import {UserDomainService} from "../../services/userDomainService.js";
import {User} from "../../domain/user.js";
import {PasswordAuthentication} from "../../domain/auth.js";

export class RegisterUserCommand {
    constructor(username, email, authenticationMethods) {
        this.username = username;
        this.email = email;
        this.authenticationMethods = authenticationMethods;
    }
}

export class RegisterUserResponse {
    constructor(id) {
        this.id = id;
    }
}

/**
 * @param command RegisterUserCommand
 * @param userDomainService UserDomainService
 */
export async function handleRegisterUser(command, userDomainService) {
    if (!command) throw new Error('Command must be provided');
    if (!userDomainService) throw new Error('User service must be provided');
    if (command.authenticationMethods.length === 0) throw new Error('Missing authentication method');

    const user = new User(command.username, command.email);
    for (const authenticationMethod of command.authenticationMethods) {
        switch (authenticationMethod.type) {
            case 'password':
                user.withAuthentication(await PasswordAuthentication.fromPlain(authenticationMethod.password));
        }
    }

    await userDomainService.createUser(user);

    return new RegisterUserResponse(user.id);
}