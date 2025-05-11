import {SqlRepository} from "./_sqlRepository.js";
import {Sqlb} from "./_sqlb.js";

export class SessionFilter {
    whereId(id) {
        this.filterId = id;
        return this;
    }
}

export class SessionRepository extends SqlRepository {
    get insertIntoSql() {
        return 'insert into sessions (id, user_id, salt, hashed_secret, valid_until)';
    }

    get insertRowSql() {
        return `($id, $userId, $salt, $hashedSecret, now() + interval '7 days')`;
    }

    mapToTable(model) {
        return {
            id: model.id,
            userId: model.userId,
            salt: model.salt,
            hashedSecret: model.hashedSecret,
        };
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb('select * from sessions'), filter);
    }

    mapFromTable(row) {
        return {
            id: row.id,
            userId: row.user_id,
            salt: row.salt,
            hashedSecret: row.hashed_secret,
        };
    }

    buildDeleteFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb('delete from sessions'), filter);
    }

    sqlWithWhereClause(sqlb, filter) {
        sqlb.add('where true');

        if (!!filter.filterId) {
            sqlb.add('and id = $id', {id: filter.filterId});
        }

        return sqlb;
    }

    async updateUsageAndValidUntil(filter) {
        const sqlb = new Sqlb('update sessions');
        sqlb.add(`set last_used = now(), valid_until = now() + interval '7 days'`)
        this.sqlWithWhereClause(sqlb, filter);
        const result = await this.execute(sqlb);
        return result.rowCount;
    }
}