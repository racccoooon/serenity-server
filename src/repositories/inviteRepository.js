import {SqlRepository} from "./_sqlRepository.js";
import {sql} from "./_shrimple.js";

export class InviteFilter {
    whereServer(serverId){
        this.filterServer = serverId;
        return this;
    }

    whereId(id){
        this.filterId = id;
        return this;
    }
}

export class InviteRepository extends SqlRepository {
    get insertIntoSql() {
        return sql`insert into invites (id, server_id, invited_by_id, valid_until)`;
    }

    mapToTable(model) {
        return sql`(${model.id}, ${model.serverId}, ${model.invitedById}, ${model.validUntil})`;
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(sql`select * from invites`, filter);
    }

    mapFromTable(row) {
        return {
            id: row.id,
            serverId: row.server_id,
            invitedById: row.invited_by_id,
            validUntil: row.valid_until,
        };
    }

    buildDeleteFromFilter(filter) {
        return this.sqlWithWhereClause(sql`delete from invites`, filter);
    }

    sqlWithWhereClause(shrimple, filter) {
        const clauses = [];

        if (filter.filterServer !== undefined){
            clauses.push(sql`server_id = ${filter.filterServer}`);
        }

        if(filter.filterId !== undefined) {
            clauses.push(sql`id = ${filter.filterId}`);
        }

        shrimple.appendMany(clauses, 'and', 'where');

        return shrimple;
    }
}