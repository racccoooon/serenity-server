import {v4} from "uuid";

/**
 * @readonly
 * @enum {string}
 */
export const AuthType = {
    PASSWORD: 'password',
};

/**
 * @typedef {Object} PasswordAuthData
 * @property {AuthType.PASSWORD} type
 * @property {string} passwordHash
 */

/** @typedef {PasswordAuthData} AuthenticationData */

export class AuthenticationMethod {
    /** @type {AuthenticationData} */
    #data;
    /** @type {UUID} */
    #id;

    /**
     * @protected
     * @param {AuthenticationData} data
     */
    constructor(data) {
        this.#id = v4();
        this.#data = data;
    }

    /**
     * @returns {UUID}
     */
    get id() {
        return this.#id;
    }

    /**
     * @returns {AuthType}
     */
    get type() {
        return this.#data.type;
    }

    /**
     * Type-safe way to access authentication data
     * @template {AuthType} T
     * @param {T} type
     * @returns {Extract<AuthenticationData, { type: T }>}
     * @throws {Error} If type doesn't match
     */
    getData(type) {
        if (this.#data.type !== type) {
            throw new Error(`Invalid auth type access. Expected ${type}, got ${this.#data.type}`);
        }
        return /** @type {any} */ (this.#data);
    }
}

export class PasswordAuthentication extends AuthenticationMethod {
    /**
     * @private
     * @param {string} passwordHash
     */
    constructor(passwordHash) {
        super({
            type: AuthType.PASSWORD,
            passwordHash
        });
    }

    get passwordHash() {
        return this.getData(AuthType.PASSWORD).passwordHash;
    }

    /**
     * Create authentication from a plain password (for new users/password changes)
     * @param {string} password
     * @returns {Promise<PasswordAuthentication>}
     */
    static async fromPlain(password) {
        const hash = "";//TODO: await bcrypt.hash(password, 12);
        return new PasswordAuthentication(hash);
    }

    /**
     * Create authentication from an existing hash (for loading from DB)
     * @param {string} passwordHash
     * @returns {PasswordAuthentication}
     */
    static fromHash(passwordHash) {
        return new PasswordAuthentication(passwordHash);
    }
}