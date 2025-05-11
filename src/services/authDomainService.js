import {AuthType} from "../domain/auth.js";
import {Session} from "../domain/session.js";

export function formatSessionToken(id, secret){
    const buf = Buffer.from(id);
    const combinedBuffer = Buffer.concat([buf, secret]);
    return `sessionToken_${combinedBuffer.toString('base64')}`;
}

/**
 *
 * @param {Session} session
 */
export function createSessionRequestModel(session) {
    const model = {};
    model.id = session.id.value;
    model.userId = session.userId.value;
    model.salt = session.salt;
    model.hashedSecret = session.hashedSecret;
    model.validUntil = session.validUntil;
    return model;
}

export class AuthDomainService {
    constructor({sessionRepository}) {
        this.sessionRepository = sessionRepository;
    }

    async logout(sessionId) {
        await this.sessionRepository.remove(sessionId.value);
    }

    /**
     *
     * @param {import('../domain/user.js').User} user
     * @param {String} password
     * @returns {String | null}
     */
    async tryPasswordLogin(user, password) {
        for (let authenticationMethod of user.authenticationMethods) {
            if (authenticationMethod.type !== AuthType.PASSWORD) {
                continue;
            }

            if (!await authenticationMethod.validateHash(password)){
                continue;
            }

            const {session, secret} = Session.gen(user.id);

            await this.sessionRepository.add(createSessionRequestModel(session));

            return formatSessionToken(session.id.value, secret);
        }

        return null;
    }
}