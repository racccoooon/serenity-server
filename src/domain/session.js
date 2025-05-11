import {NewType} from "./_newType.js";
import {z} from "zod";
import {UserId, userIdSchema} from "./user.js";
import {v4} from "uuid";
import { randomBytes, createHash } from 'crypto';
import {DateTime} from "luxon";

export const sessionTokenSchema = z.string().trim().nonempty();

export class SessionToken extends NewType {
    validate(value) {
        sessionTokenSchema.parse(value)
    }
}

export const sessionIdSchema = z.string().uuid()

export class SessionId extends NewType {
    validate(value) {
        sessionIdSchema.parse(value)
    }

    static gen() {
        return new SessionId(v4());
    }
}

export class Session {
    #id;
    #userId;
    #salt;
    #hashedSecret;
    #validUntil;

    /**
     * @param {import('user.js').UserId} userId
     * @returns {{session: Session, secret: Buffer}}
     */
    static gen(userId) {
        if (!(userId instanceof UserId)) throw new Error('UserId must be a UserId');

        const salt = randomBytes(16);
        const secret = randomBytes(16);

        const hash = createHash('sha256');
        hash.update(secret);
        hash.update(salt);
        const hashedSecret = hash.digest();

        const session = new Session();
        session.#id = SessionId.gen();
        session.#userId = userId;
        session.#salt = salt;
        session.#hashedSecret = hashedSecret;
        session.#validUntil = DateTime.now().plus({days: 7});
        return { session, secret };
    }

    /**
     *
     * @param {SessionId} id
     * @param {UserId} userId
     * @param {Buffer} salt
     * @param {Buffer} hashedSecret
     * @param {Date} validUntil
     * @returns {Session}
     */
    static from(id, userId, salt, hashedSecret, validUntil) {
        if (!(id instanceof SessionId)) throw new Error('Id must be a SessionId');
        if (!(userId instanceof UserId)) throw new Error('UserId must be a UserId');

        const session = new Session();
        session.#id = id;
        session.#userId = userId;
        session.#salt = salt;
        session.#hashedSecret = hashedSecret;
        session.#validUntil = validUntil;
        return session;
    }

    get id(){
        return this.#id;
    }

    get userId() {
        return this.#userId;
    }

    get salt() {
        return this.#salt;
    }

    get hashedSecret() {
        return this.#hashedSecret;
    }

    get validUntil() {
        return this.#validUntil;
    }
}