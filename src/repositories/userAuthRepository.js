import {SqlRepository} from "./_sqlRepository.js";
import {sql} from "./_shrimple.js";

export class UserAuthFilter {
    whereUserId(userId) {
        this.filterUserId = userId;
        return this;
    }

    whereType(type){
        this.filterType = type;
        return this;
    }
}

export class UserAuthRepository extends SqlRepository {
    get insertIntoSql() {
        return sql`insert into user_auth (id, user_id, type, details)`;
    }

    mapToTable(model) {
        return sql`(${model.id}, ${model.userId}, ${model.type}, ${model.details})`;
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(sql`select * from user_auth`, filter);
    }

    sqlWithWhereClause(shrimple, filter){
        const clauses = [];

        if (filter.filterUserId !== undefined) {
            clauses.push(sql`user_id = ${filter.filterUserId}`);
        }

        if (filter.filterType !== undefined) {
            clauses.push(sql`type = ${filter.filterType}`);
        }

        shrimple.appendMany(clauses, 'and', 'where');

        return shrimple;
    }

    mapFromTable(row) {
        return {
            id: row.id,
            type: 'password',
            details: row.details,
        };
    }
}