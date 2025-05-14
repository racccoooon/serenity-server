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
            groupId: row.group_id,
            name: row.name,
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

    async update(channel){
        const {id, ...values} = channel;
        if(Object.entries(values).length === 0) return;

        const sqlb = new Sqlb(`update channels set`);

        if(values.name !== undefined) {
            sqlb.add(`name = $name`, {name: values.name});
        }

        if(values.groupId !== undefined) {
            sqlb.add(`group_id = $groupId, `, {groupId: values.groupId});
        }

        if(values.rank !== undefined) {
            sqlb.add(`rank = $rank`, {rank: values.rank});
        }

        sqlb.add(`where id = $id`, {id: id});
        await this.execute(sqlb);
    }

    async getBiggestRank(groupId) {
        const sqlb = new Sqlb(`
                    select rank
                    from channels
                    where group_id = $groupId
                    order by rank desc limit 1`,
            {groupId: groupId});

        const result = await this.execute(sqlb);
        return result.rows.map(row => row.rank)[0] ?? null;
    }
}

