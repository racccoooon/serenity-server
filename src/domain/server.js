import {NewType} from "./_newType.js";
import {z} from "zod";
import {v4} from "uuid";
import {UserId} from "./user.js";

export const serverIdSchema = z.string().uuid()

export class ServerId extends NewType{
    validate(value) {
        serverIdSchema.parse(value)
    }

    static gen() {
        return new ServerId(v4());
    }
}

export class Server{
    /** @type {ServerId} */
    #id;
    /** @type {UserId} */
    #ownerId;
    /** @type {String} */
    #name;
    /** @type {String|null} */
    #description;

    /**
     * @param {UserId} ownerId
     * @param {String} name
     * @param {String|null} description
     * @param {ServerId|null} id
     */
    constructor(ownerId, name, description, id = null) {
        if (!(ownerId instanceof UserId)) throw new Error('OwnerId must be a UserId');
        if (typeof name !== 'string') throw new Error('Name must be a string');

        if(id){
            if(!(id instanceof ServerId)) throw new Error('Id must be a ServerId');
            this.#id = id;
        }else{
            this.#id = ServerId.gen();
        }

        this.#ownerId = ownerId;
        this.#name = name;
        this.#description = description;
    }

    get id() {
        return this.#id;
    }

    get ownerId() {
        return this.#ownerId;
    }

    get name() {
        return this.#name;
    }

    get description() {
        return this.#description;
    }
}