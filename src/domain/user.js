import {v4, v4 as uuidv4} from 'uuid';

export class User {
    /** @type {UUID} */
    #id;
    /** @type {string} */
    #username;
    /** @type {string} */
    #email;


    /** @type {import('./auth').AuthenticationMethod[]} */
    #authenticationMethods = [];

    /**
     * @param {string} username
     * @param {string} email
     */
    constructor(username, email) {
        if (typeof username !== 'string') {
            throw new Error('Username must be a string');
        }
        if (typeof email !== 'string') {
            throw new Error('Email must be a string');
        }

        this.#id = v4();

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