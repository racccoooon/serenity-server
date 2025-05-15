import {SqlRepository} from "./_sqlRepository.js";
import {sql} from "./_shrimple.js";

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
        return sql`insert into channels (id, group_id, name, rank)`;
    }

    mapToTable(model) {
        return sql`(${model.id}, ${model.groupId}, ${model.name}, ${model.rank})`;
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(sql`select c.*
                                                 from channels as c`, filter);
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
        return this.buildSelectFromFilter(sql`delete
                                              from channels`, filter)
    }

    sqlWithWhereClause(shrimple, filter) {
        if(filter.filterServer !== undefined){
            shrimple.append`join channel_groups g on c.group_id = g.id`
        }

        const clauses = [];

        if (filter.filterGroup !== undefined) {
            clauses.push(sql`c.group_id = ${filter.filterGroup}`);
        }

        if(filter.filterServer !== undefined){
            clauses.push(sql`g.server_id = ${filter.filterServer}`);
        }

        shrimple.appendMany(clauses, 'and', 'where');

        return shrimple;
    }

    async update(channel){
        const setters = [];

        if(channel.name !== undefined) {
            setters.push(sql`name = ${channel.name}`);
        }

        if(channel.groupId !== undefined) {
            setters.push(sql`group_id = ${channel.groupId}`);
        }

        if(channel.rank !== undefined) {
            setters.push(sql`rank = ${channel.rank}`);
        }

        if (setters.length === 0) return;

        const shrimple = sql`update channels set`;
        shrimple.appendMany(setters, ',');

        shrimple.append`where id = ${channel.id}`;

        await this.execute(shrimple);
    }

    async getBiggestRank(groupId) {
        const shrimple = sql`
                    select rank
                    from channels
                    where group_id = ${groupId}
                    order by rank desc limit 1`;

        const result = await this.execute(shrimple);
        return result.rows.map(row => row.rank)[0] ?? null;
    }
}

