import {SqlRepository} from "./_sqlRepository.js";
import {Sqlb} from "./_sqlb.js";
import {sql} from "./_shrimple.js";

export class SessionFilter {
    whereId(id) {
        this.filterId = id;
        return this;
    }
}

export class SessionRepository extends SqlRepository {
    get insertIntoSql() {
        return sql`insert into sessions (id, user_id, salt, hashed_secret, valid_until)`;
    }

    mapToTable(model) {
        return sql`(${model.id}, ${model.userId}, ${model.salt}, ${model.hashedSecret}, now() + interval '7 days')`;
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(sql`select *
                                           from sessions`, filter);
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
        return this.sqlWithWhereClause(sql`delete
                                           from sessions`, filter);
    }

    sqlWithWhereClause(shrimple, filter) {
        const clauses = [];

        if (filter.filterId !== undefined) {
            clauses.push(sql`id
            =
            ${filter.filterId}`);
        }

        shrimple.appendMany(clauses, 'and', 'where');

        return shrimple;
    }

    async updateUsageAndValidUntil(filter) {
        const shrimple = sql`update sessions set last_used = now(), valid_until = now() + interval '7 days'`;
        this.sqlWithWhereClause(shrimple, filter);
        const result = await this.execute(shrimple);
        return result.rowCount;
    }
}