import {UserId, UserName} from "../domain/user.js";
import {logger} from "../utils/logger.js";
import {Sqlb} from "./_sqlb.js";
import {SqlRepository} from "./Repository.js";
import {chunked, isLastIndex} from "../utils/index.js";

export class UserModel {
    constructor(id, username, email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}

export class UserRepository extends SqlRepository {
    async add(...users) {
        if (users.length === 0) return;

        for (let chunk of chunked(users)) {
            const sqlb = new Sqlb('insert into users (id, username, email) values');

            for (let i = 0; i < chunk.length; i++) {
                const user = chunk[i];

                sqlb.add('($id, $username, $email)', {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                });

                if (!isLastIndex(i, chunk)) {
                    sqlb.add(",");
                }
            }

            await this.execute(sqlb);
        }
    }

    async find(selector) {
        let sqlb = new Sqlb(
            `select id, username, email
             from users
             where`
        );

        switch (true) {
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