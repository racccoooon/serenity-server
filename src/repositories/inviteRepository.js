import {SqlRepository} from "./_sqlRepository.js";
import {Sqlb} from "./_sqlb.js";

export class InviteRepository extends SqlRepository {
    get insertIntoSql() {
        return `insert into invites (id, invited_by_id, valid_until)`;
    }

    get insertRowSql() {
        return `($id, $invitedById, $validUntil)`;
    }

    mapToTable(model) {
        return {
            id: model.id,
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
            invitedById: row.invited_by_id,
            validUntil: row.valid_until,
        };
    }

    buildDeleteFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb(`delete from invites`), filter);
    }

    sqlWithWhereClause(sqlb, filter) {
        sqlb.add(`where true`);

        return sqlb;
    }
}