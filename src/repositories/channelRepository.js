import {SqlRepository} from "./_sqlRepository.js";
import {Sqlb} from "./_sqlb.js";

export class ChannelFilter{
    whereServer(serverId){
        this.filterServer = serverId;
        return this;
    }
}

export class ChannelRepository extends SqlRepository{
    get insertIntoSql() {
        return `insert into channels (id, server_id, name, group, rank)`;
    }

    get insertRowSql(){
        return `($id, $serverId, $name, $group, $rank)`;
    }

    mapToTable(model) {
        return {
            id: model.id,
            serverId: model.serverId,
            name: model.name,
            group: model.group,
            rank: model.rank,
        };
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb(`select * from channels`), filter);
    }

    mapFromTable(row) {
        return {
            id: row.id,
            serverId: row.server_id,
            name: row.name,
            group: row.group,
            rank: row.rank,
        }
    }

    buildDeleteFromFilter(filter) {
        return this.buildSelectFromFilter(new Sqlb(`delete from channels`), filter)
    }

    sqlWithWhereClause(sqlb, filter) {
        sqlb.add(`where true`);

        if (filter.filterServer !== undefined){
            sqlb.add(`and server_id = $serverId`, {serverId: filter.filterServer});
        }

        return sqlb;
    }
}

