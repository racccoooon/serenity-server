import {pool} from "../db/index.js";

export class CreateUserModel {
    constructor(id, username, email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}

export class UserModel {}

export class UserRepository {
    async add(param) {
        await pool.query(`
            insert into users (id, username, email)
            values ($1, $2, $3);`,
            [param.id, param.username, param.email]);
    }

    async find(selector) {

    }
}