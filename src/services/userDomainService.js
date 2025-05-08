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
    model.id = user.id.value;
    model.username = user.username.value;
    model.email = user.email;
    return model;
}

/**
 * Maps a User domain model to CreateUserModel
 * @param {import('../domain/user.js').UserId} userId
 * @param {import('../domain/user.js').AuthenticationMethod} method
 * @returns {CreatePasswordModel}
 */
export function createPasswordRequestModel(userId, method)
{
    if (method.type !== AuthType.PASSWORD) {
        throw new Error('Invalid authentication type, expected type password');
    }

    const data = method.getData(AuthType.PASSWORD)

    const model = new CreatePasswordModel();
    model.id = method.id;
    model.userId = userId.value;
    model.details = data;
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
                    await this.userAuthRepository.addPassword(createPasswordRequestModel(user.id, authenticationMethod));
            }
        }
    }

    /**
     * @param {import('../domain/user').UserSelector} selector
     * @returns {Promise<import('../domain/user').User>|null}
     */
    findUser = async (selector) => {
        return null;
    }
}

