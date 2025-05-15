import {Sqlb} from "./_sqlb.js";
import {SqlRepository} from "./_sqlRepository.js";
import {sql} from "./_shrimple.js";

export class UserFilter {
    whereId(id) {
        this.filterId = id;
        return this;
    }

    whereUsername(username){
        this.filterUsername = username;
        return this;
    }
}

export class UserRepository extends SqlRepository {
    get insertIntoSql() {
        return sql`insert into users (id, username, email, is_local)`;
    }

    mapToTable(model) {
        return sql`(${model.id}, ${model.username}, ${model.email}, ${model.isLocal})`;
    }

    buildSelectFromFilter(filter){
        return this.sqlWithWhereClause(sql`select * from users`, filter);
    }

    sqlWithWhereClause(shrimple, filter){
        const clauses = [];

        if (filter.filterId !== undefined) {
            clauses.push(sql`id = ${filter.filterId}`);
        }

        if (filter.filterUsername !== undefined) {
            clauses.push(sql`username = ${filter.filterUsername}`);
        }

        shrimple.appendMany(clauses, 'and', 'where');

        return shrimple;
    }

    mapFromTable(row) {
        return {
            id: row.id,
            username: row.username,
            email: row.email,
            isLocal: row.is_local,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}