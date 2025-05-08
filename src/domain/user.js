import {v4} from 'uuid';
import {NewType} from "./_newType.js";

export class UserName extends NewType {
    validate(value) {
        if (typeof value !== 'string') {
            throw new Error("UserName must be a string.");
        }

        const trimmed = value.trim();

        if (trimmed.length === 0) {
            throw new Error("UserName cannot be empty.");
        }

        if (trimmed.length > 63) {
            throw new Error("UserName must be at most 63 characters long.");
        }
    }
}

export class UserId extends NewType {
    validate(value) {
        if (typeof value !== 'string' || !validateUUID(value)) {
            throw new Error("UserId must be a valid UUID string.");
        }
    }
}

export class User {
    /** @type {UserId} */
    #id;
    /** @type {UserName} */
    #username;
    /** @type {string} */
    #email;


    /** @type {import('./auth').AuthenticationMethod[]} */
    #authenticationMethods = [];

    /**
     * @param {UserName} username
     * @param {string} email
     */
    constructor(username, email) {
        if (!(username instanceof UserName)) {
            throw new Error('Username must be a UserName');
        }
        if (typeof email !== 'string') {
            throw new Error('Email must be a string');
        }

        this.#id = new UserId(v4());

        this.#username = username;
        this.#email = email;
    }

    get id() {
        return this.#id;
    }

    get username() {
        return this.#username;
    }

    get email() {
        return this.#email;
    }

    get authenticationMethods() {
        return this.#authenticationMethods;
    }

    /**
     * Add an authentication method to the user.
     * @param {import('./auth').AuthenticationMethod} authenticationMethod
     * @returns {User} Returns this user instance for method chaining.
     */
    withAuthentication(authenticationMethod) {
        this.#authenticationMethods.push(authenticationMethod);
        return this;
    }
}