import {AuthType} from "../domain/auth.js";
import {CreateUserModel} from "../repositories/userRepository.js";
import {CreatePasswordModel} from "../repositories/userAuthRepository.js";

/**
 * Maps a User domain model to CreateUserModel
 * @param {import('../domain/user').User} user
 * @returns {CreateUserModel}
 */
export function createUserRequestModel(user)
{
    const model = new CreateUserModel();
    model.id = user.id;
    model.username = user.username;
    model.email = user.email;
    return model;
}

/**
 * Maps a User domain model to CreateUserModel
 * @param {import('../domain/auth.js').PasswordAuthentication} data
 * @returns {CreatePasswordModel}
 */
export function createPasswordRequestModel(data)
{
    const model = new CreatePasswordModel();
    model.id = data.id;
    model.hash = data.passwordHash;
    return model;
}



export class UserDomainService {
    /**
     * Creates a new UserDomainService instance.
     * @param {{
     *    userRepository: import('../repositories/userRepository').UserRepository,
     *    userAuthRepository:  import('../repositories/userAuthRepository.js').UserAuthRepository,
     * }} param0
     */
    constructor({userRepository, userAuthRepository}) {
        this.userRepository = userRepository;
        this.userAuthRepository = userAuthRepository;
    }

    /**
     * @param {import('../domain/user').User} user
     * @returns {Promise<void>}
     */
    createUser = async (user) => {
        if (user.authenticationMethods.length === 0) {
            throw new Error('User must have at least one authentication method');
        }

        await this.userRepository.add(createUserRequestModel(user));
        for (const authenticationMethod of user.authenticationMethods) {
            switch (authenticationMethod.type) {
                case AuthType.PASSWORD:
                    const data = authenticationMethod.getData(AuthType.PASSWORD);
                    await this.userAuthRepository.addPassword({
                        id: authenticationMethod.id,
                        hash: data.passwordHash,
                    });
            }
        }
    }
}

