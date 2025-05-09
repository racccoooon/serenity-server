import {pool} from "../db/index.js";

export class CreateSessionModel {
    constructor(id, userId, salt, hashedSecret) {
        this.id = id;
        this.userId = userId;
        this.salt = salt;
        this.hashedSecret = hashedSecret;
    }
}

export class SessionRepository {
    async add(param) {
        await pool.query(`
            insert into sessions(id, user_id, salt, hashed_secret)
            values ($1, $2, $3, $4);`,
            [param.id, param.userId, param.salt, param.hashedSecret]);
    }
}