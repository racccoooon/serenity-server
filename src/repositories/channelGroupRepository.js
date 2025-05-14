import {SqlRepository} from "./_sqlRepository.js";
import {Sqlb} from "./_sqlb.js";

export class ChannelGroupFilter {
    whereId(id) {
        this.filterId = id;
        return this;
    }

    whereServer(serverId){
        this.filterServer = serverId;
        return this;
    }

    whereName(name){
        this.filterName = name;
        return this;
    }
}

export class ChannelGroupRepository extends SqlRepository {
    get insertIntoSql() {
        return `insert into channel_groups (id, server_id, name, rank)`;
    }

    get insertRowSql() {
        return `($id, $serverId, $name, $rank)`;
    }

    mapToTable(model) {
        return {
            id: model.id,
            serverId: model.serverId,
            name: model.name,
            rank: model.rank,
        };
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb(`select *
                                                 from channel_groups`), filter);
    }

    mapFromTable(row) {
        return {
            id: row.id,
            serverId: row.server_id,
            name: row.name,
            rank: row.rank,
        };
    }

    buildDeleteFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb(`delete from channel_groups`), filter);
    }

    sqlWithWhereClause(sqlb, filter) {
        sqlb.add(`where true`);

        if (filter.filterId !== undefined) {
            sqlb.add(`and id = $id`, {id: filter.filterId});
        }

        if(filter.filterServer !== undefined){
            sqlb.add(`and server_id = $serverId`, {serverId: filter.filterServer});
        }

        if(filter.filterName !== undefined){
            sqlb.add(`and name = $name`, {name: filter.filterName});
        }

        return sqlb;
    }

    async update(group){
        const {id, ...values} = group;
        if(Object.entries(values).length === 0) return;

        const sqlb = new Sqlb(`update channel_groups set`);

        if(values.name !== undefined) {
            sqlb.add(`name = $name`, {name: values.name});
        }

        sqlb.add(`where id = $id`, {id: id});
        await this.execute(sqlb);
    }

    async getBiggestRank(serverId) {
        const sqlb = new Sqlb(`
                    select rank
                    from channel_groups
                    where server_id = $serverId`,
            {serverId: serverId});

        sqlb.add(`order by rank desc limit 1`);

        const result = await this.execute(sqlb);
        return result.rows.map(row => row.rank)[0] ?? null;
    }
}