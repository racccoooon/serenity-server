import {UserId, UserName} from "../domain/user.js";
import {logger} from "../utils/logger.js";
import {Sqlb} from "./_sqlb.js";
import {SqlRepository} from "./Repository.js";
import {chunked, isLastIndex} from "../utils/index.js";

export class UserFilter {
    whereId(id) {
        this.filterId = id;
        return this;
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

    async first(filter) {
        const sqlb = new Sqlb('select * from users where true');

        if(!!filter.filterId){
            sqlb.add('and id = id', {id: filter.filterId});
        }

        sqlb.add('limit 1');

        const result = await this.execute(sqlb);
        return result.rows.map(row => ({
            id: row.id,
            username: row.username,
            email: row.email,
        }))[0] ?? null;
    }
}