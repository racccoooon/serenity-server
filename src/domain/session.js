import {NewType} from "./_newType.js";
import {z} from "zod";
import {UserId, userIdSchema} from "./user.js";
import {v4} from "uuid";

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

    static fresh() {
        return new SessionId(v4());
    }
}

export class Session {
    #id;
    #userId;

    /**
     * @param {import('user.js').UserId} userId
     * @param {SessionId|null} id
     */
    constructor(userId, id = null) {
        if (!(userId instanceof UserId)) throw new Error('UserId must be a UserId');

        if (id) {
            if (!(id instanceof SessionId)) throw new Error('Id must be a SessionId');
            this.#id = id;
        } else {
            this.#id = SessionId.fresh();
        }

        this.#userId = userId;
    }

    get id(){
        return this.#id;
    }

    get userId() {
        return this.#userId;
    }
}