import {AuthType} from "../domain/auth.js";

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

            return "";
        }

        return null;
    }
}