import {v4} from "uuid";
import bcrypt from "bcryptjs";

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

export class RegisterUserHandler {
    constructor(userRepository, userAuthRepository) {
        this.userRepository = userRepository;
        this.userAuthRepository = userAuthRepository;
    }

    /**
     * @param command RegisterUserCommand
     */
    handle = async (command) => {
        if (!command) throw new Error('Command must be provided');
        if (command.authenticationMethods.length === 0) throw new Error('Missing authentication method');

        const user = {
            id: v4(),
            username: command.username,
            email: command.email
        };
        await this.userRepository.add(user);

        for (const authenticationMethod of command.authenticationMethods) {
            switch (authenticationMethod.type) {
                case 'password':
                    const hash = await bcrypt.hash(authenticationMethod.details.password, 12);
                    const password = {
                        id: v4(),
                        userId: user.id,
                        type: 'password',
                        details: {
                            hash: hash,
                        }
                    };
                    this.userAuthRepository.add(password)
                    break;
                default:
                    throw new Error(`Unsupported authentication method '${authenticationMethod.type}'`);
            }
        }

        return new RegisterUserResponse(user.id);
    };
}