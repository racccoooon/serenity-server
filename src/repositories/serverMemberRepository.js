import {SqlRepository} from "./_sqlRepository.js";
import {sql} from "./_shrimple.js";

export class ServerMemberFilter {
    whereServerId(serverId){
        this.filterServerId = serverId;
        return this;
    }

    whereUserId(userId){
        this.filterUserId = userId;
        return this;
    }
}

export class ServerMemberRepository extends SqlRepository {
    get insertIntoSql() {
        return sql`insert into server_members (id, user_id, server_id)`
    }

    mapToTable(model) {
        return sql`(${model.id}, ${model.userId}, ${model.serverId})`
    }

    sqlWithWhereClause(shrimple, filter) {
        const clauses = []

        if (filter.filterUserId !== undefined) {
            clauses.push(sql`user_id = ${filter.filterUserId}`);
        }

        if (filter.filterServerId !== undefined) {
            clauses.push(sql`server_id = ${filter.filterServerId}`);
        }

        shrimple.appendMany(clauses, 'and', 'where');

        return shrimple;
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(sql`select * from server_members`, filter);
    }

    mapFromTable(row) {
        return {
            id: row.id,
            userId: row.user_id,
            serverId: row.server_id,
        };
    }

    buildDeleteFromFilter(filter) {
        return this.sqlWithWhereClause(sql`delete from server_members`, filter);
    }
}