import {pool} from "../db/index.js";

export class SessionModel {
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

    async find(id) {
        const result = await pool.query(`select id, user_id, salt, hashed_secret
                    from sessions
                    where id = $1`,
            [id]);

        const sessions = result.rows.map(row => new SessionModel(
            row.id,
            row.user_id,
            row.salt,
            row.hashed_secret
        ));

        if(sessions.length === 1){
            return sessions[0];
        }

        return null;
    }
}