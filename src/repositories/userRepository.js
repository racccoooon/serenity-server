import {pool} from "../db/index.js";
import {UserId, UserName} from "../domain/user.js";
import {logger} from "../utils/logger.js";

export class UserModel {
    constructor(id, username, email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}

export class UserRepository {
    async add(param) {
        await pool.query(`
            insert into users (id, username, email)
            values ($1, $2, $3);`,
            [param.id, param.username, param.email]);
    }

    async find(selector) {
        let sqlb = new Sqlb(
            `select id, username, email from users where`
        );

        switch (true){
            case selector.value instanceof UserId:
                sqlb.add('id = $id', {id: selector.value.value});
                break;
            case selector.value instanceof UserName:
                sqlb.add('username = $username', {username: selector.value.value});
                break;
            default:
                throw new Error('Unreachable');
        }

        const {sql, params} = sql.build();
        logger.debug("executing sql: ", sql);
        const result = await pool.query(sql, params);

        const users = result.rows.map(row => new UserModel(row.id, row.username, row.email));

        if (users.length === 1) {
            return users[0];
        }

        return null;
    }
}