import {SqlRepository} from "./_sqlRepository.js";
import {Sqlb} from "./_sqlb.js";

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
        return `insert into server_members (id, user_id, server_id)`
    }

    get insertRowSql() {
        return `($id, $userId, $serverId)`;
    }

    mapToTable(model) {
        return {
            id: model.id,
            userId: model.userId,
            serverId: model.serverId,
        };
    }

    sqlWithWhereClause(sqlb, filter) {
        sqlb.add('where true');

        if (!!filter.filterUserId) {
            sqlb.add('and user_id = $userId', {userId: filter.filterUserId});
        }

        if (!!filter.filterServerId) {
            sqlb.add('and user_id = $serverId', {serverId: filter.filterServerId});
        }

        return sqlb;
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb(`select * form server_members`), filter);
    }

    mapFromTable(row) {
        return {
            id: row.id,
            userId: row.user_id,
            serverId: row.server_id,
        };
    }

    buildDeteFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb(`delete from server_members`), filter);
    }
}