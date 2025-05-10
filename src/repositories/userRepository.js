import {UserId, UserName} from "../domain/user.js";
import {logger} from "../utils/logger.js";
import {Sqlb} from "./_sqlb.js";

export class UserModel {
    constructor(id, username, email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}

export class UserRepository {
    constructor(dbTransaction) {
        this.dbTransaction = dbTransaction;
    }

    async add(param) {
        const tx = await this.dbTransaction.tx();
        await tx.query(`
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

        const {sql, params} = sqlb.build();
        logger.debug(`executing sql: ${sql}`);
        const tx = await this.dbTransaction.tx();
        const result = await tx.query(sql, params);

        const users = result.rows.map(row => new UserModel(row.id, row.username, row.email));

        if (users.length === 1) {
            return users[0];
        }

        return null;
    }
}