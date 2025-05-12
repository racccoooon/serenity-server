import {SqlRepository} from "./_sqlRepository.js";
import {Sqlb} from "./_sqlb.js";

export class ChannelFilter {
    whereChannelGroup(groupId) {
        this.filterGroup = groupId;
        return this;
    }

    whereServer(serverId){
        this.filterServer = serverId;
        return this;
    }
}

export class ChannelRepository extends SqlRepository {
    get insertIntoSql() {
        return `insert into channels (id, group_id, name, rank)`;
    }

    get insertRowSql() {
        return `($id, $groupId, $name, $rank)`;
    }

    mapToTable(model) {
        return {
            id: model.id,
            groupId: model.groupId,
            name: model.name,
            rank: model.rank,
        };
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb(`select c.*
                                                 from channels as c`), filter);
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
        return this.buildSelectFromFilter(new Sqlb(`delete
                                                    from channels`), filter)
    }

    sqlWithWhereClause(sqlb, filter) {
        if(filter.filterServer !== undefined){
            sqlb.add(`join channel_groups g on c.group_id = g.id`)
        }

        sqlb.add(`where true`);

        if (filter.filterGroup !== undefined) {
            sqlb.add(`and c.group_id = $groupId`, {groupId: filter.filterGroup});
        }

        if(filter.filterServer !== undefined){
            sqlb.add(`and g.server_id = $serverId`, {serverId: filter.filterServer});
        }

        return sqlb;
    }

    async getBiggestRank(serverId, groupId) {
        const sqlb = new Sqlb(`
                    select c.rank
                    from channels as c
                    join channel_groups g on g.id = c.group_id
                    where g.server_id = $serverId`,
            {serverId: serverId});

        if (groupId) {
            sqlb.add(`and "group_id" = $groupId`, {groupId: groupId});
        }

        sqlb.add(`order by rank desc limit 1`);

        const result = await this.execute(sqlb);
        return result.rows.map(row => row.rank)[0] ?? null;
    }
}

