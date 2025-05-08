import {pool} from "../db/index.js";

export class CreatePasswordModel {
    constructor(id, userId, details) {
        this.id = id;
        this.userId = userId;
        this.details = details;
    }
}

export class PasswordAuthMethodModel {
    constructor(hash) {
        this.hash = hash;
    }
}

export class AuthMethodModel {
    constructor(type, details) {
        this.type = type;
        this.details = details;
    }
}

export class UserAuthRepository {
    async addPassword(param) {
        await pool.query(`
            insert into user_auth (id, user_id, type, details)
            values ($1, $2, $3, $4);`,
            [param.id, param.userId, 'password', param.details]);
    }

    async byUserId(userId) {
        
    }
}