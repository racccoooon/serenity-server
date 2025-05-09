import {AuthType, PasswordAuthentication} from "../domain/auth.js";
import {UserModel} from "../repositories/userRepository.js";
import {AuthMethodModel, PasswordAuthDetailsModel} from "../repositories/userAuthRepository.js";
import {User, UserId, UserName, UserSelector} from "../domain/user.js";

/**
 * Maps a User domain model to CreateUserModel
 * @param {import('../domain/user').User} user
 * @returns {UserModel}
 */
export function createUserRequestModel(user)
{
    const model = new UserModel();
    model.id = user.id.value;
    model.username = user.username.value;
    model.email = user.email;
    return model;
}

/**
 * @param {import('../domain/user.js').UserId} userId
 * @param {import('../domain/auth.js').AuthenticationMethod} method
 * @returns {AuthMethodModel}
 */
export function createPasswordRequestModel(method)
{
    if (method.type !== AuthType.PASSWORD) {
        throw new Error('Invalid authentication type, expected type password');
    }

    const model = new AuthMethodModel();
    model.id = method.id;
    model.details = new PasswordAuthDetailsModel(method.passwordHash);
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
    async createUser (user) {
        if (user.authenticationMethods.length === 0) {
            throw new Error('User must have at least one authentication method');
        }

        await this.userRepository.add(createUserRequestModel(user));
        for (const authenticationMethod of user.authenticationMethods) {
            switch (authenticationMethod.type) {
                case AuthType.PASSWORD:
                    await this.userAuthRepository.addPassword(user.id, createPasswordRequestModel(authenticationMethod));
            }
        }
    }

    /**
     * @param {import('../domain/user').UserSelector} selector
     * @returns {Promise<import('../domain/user').User|null>}
     */
    async findUser(selector) {
        if (!selector) throw new Error('selector must be provided');
        if (!(selector instanceof UserSelector)) throw new Error('selector must be a UserSelector');

        const userModel = await this.userRepository.find(selector);
        if(!userModel) {
            return null;
        }

        const user = new User(
            new UserName(userModel.username),
            userModel.email,
            new UserId(userModel.id));

        const authMethods = await this.userAuthRepository.byUserId(userModel.id);
        for (let authMethod of authMethods) {
            switch (authMethod.type) {
                case 'password':
                    user.withAuthentication(PasswordAuthentication.fromHash(authMethod.details.hash));
                    break;
            }
        }

        return user;
    }
}

