import {SqlRepository} from "./_sqlRepository.js";
import {sql} from "./_shrimple.js";

export class ServerFilter{
    whereIsMember(userId){
        this.filterIsMember = userId;
        return this;
    }
}

export class ServerRepository extends SqlRepository {
    get insertIntoSql() {
        return sql`insert into servers (id, owner_id, name, description)`;
    }

    mapToTable(model) {
        return sql`(${model.id}, ${model.ownerId}, ${model.name}, ${model.description})`;
    }

    sqlWithWhereClause(shrimple, filter) {
        const clauses = [];

        if (filter.filterIsMember !== undefined) {
            clauses.push(sql`exists (select true from server_members where server_id = servers.id and user_id = ${filter.filterIsMember})`);
        }

        shrimple.appendMany(clauses, 'and', 'where');

        return shrimple;
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(sql`select * from servers`, filter);
    }

    mapFromTable(row) {
        return {
            id: row.id,
            ownerId: row.owner_id,
            name: row.name,
            description: row.description,
        };
    }

    buildDeleteFromFilter(filter) {
        return this.sqlWithWhereClause(sql`delete from servers`, filter);
    }
}