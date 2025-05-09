import {AuthType} from "../domain/auth.js";
import {CreateSessionModel} from "../repositories/sessionRepository.js";
import {Session} from "../domain/session.js";

export function createSessionRequestModel(session) {
    const model = new CreateSessionModel();
    model.id = session.id.value;
    model.userId = session.userId.value;
    return model;
}

export class AuthDomainService {
    constructor({sessionRepository}) {
        this.sessionRepository = sessionRepository;
    }

    /**
     *
     * @param {import('../domain/user.js').User} user
     * @param {String} password
     * @returns {import('../domain/session.js').SessionToken | null}
     */
    async tryPasswordLogin(user, password) {
        for (let authenticationMethod of user.authenticationMethods) {
            if (authenticationMethod.type !== AuthType.PASSWORD) {
                continue;
            }

            if (!await authenticationMethod.validateHash(password)){
                return null;
            }

            const session = new Session(user.id);

            await this.sessionRepository.add(createSessionRequestModel(session));
            return session;
        }

        return null;
    }
}