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
    get insertIntoSql() {
        return 'insert into users (id, username, email)';
    }

    get insertRowSql() {
        return '($id, $username, $email)';
    }

    mapToTable(model) {
        return {
            id: model.id,
            username: model.username,
            email: model.email,
        };
    }

    async first(filter) {
        const sqlb = new Sqlb('select * from users where true');

        if (!!filter.filterId) {
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