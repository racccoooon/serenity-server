import {v4} from 'uuid';
import {NewType} from "./_newType.js";
import {Union} from "./_union.js";
import {z} from "zod";

export const userNameSchema = z.string({
    message: "UserName must be a string."
}).trim().nonempty("UserName cannot be empty.").max(63, "UserName must be at most 63 characters long.")

export class UserName extends NewType {
    validate(value) {
        userNameSchema.parse(value)
    }
}

export const userIdSchema = z.string().uuid()

export class UserId extends NewType {
    validate(value) {
        userIdSchema.parse(value)
    }
}

export class UserSelector extends Union(UserId, UserName) {}

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
    constructor(username, email, id = null) {
        if (!(username instanceof UserName)) throw new Error('Username must be a UserName');
        if (typeof email !== 'string') throw new Error('Email must be a string');

        if(id)
        {
            if(!(id instanceof UserId)) throw new Error('Id must be a UserId');
            this.#id = id;
        }
        else
        {
            this.#id = new UserId(v4());
        }

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