import {SqlRepository} from "./_sqlRepository.js";
import {Sqlb} from "./_sqlb.js";

export class InviteFilter {
    whereServer(serverId){
        this.filterServer = serverId;
        return this;
    }
}

export class InviteRepository extends SqlRepository {
    get insertIntoSql() {
        return `insert into invites (id, server_id, invited_by_id, valid_until)`;
    }

    get insertRowSql() {
        return `($id, $serverId, $invitedById, $validUntil)`;
    }

    mapToTable(model) {
        return {
            id: model.id,
            serverId: model.serverId,
            invitedById: model.invitedById,
            validUntil: model.validUntil,
        };
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb(`select * from invites`), filter);
    }

    mapFromTable(row) {
        return{
            id: row.id,
            serverId: row.server_id,
            invitedById: row.invited_by_id,
            validUntil: row.valid_until,
        };
    }

    buildDeleteFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb(`delete from invites`), filter);
    }

    sqlWithWhereClause(sqlb, filter) {
        sqlb.add(`where true`);

        if (!!filter.filterServer){
            sqlb.add(`and server_id = $serverId`, {serverId: filter.filterServer})
        }

        return sqlb;
    }
}