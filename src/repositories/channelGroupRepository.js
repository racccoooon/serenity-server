import {SqlRepository} from "./_sqlRepository.js";
import {sql} from "./_shrimple.js";

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

    whereIsDefault() {
        this.filterDefault = true;
        return this;
    }

    orderByRank() {
        this.ordering = {column: "rank", direction: "asc"};
        return this;
    }
}

export class ChannelGroupRepository extends SqlRepository {
    get insertIntoSql() {
        return sql`insert into channel_groups (id, server_id, name, rank, is_default)`;
    }

    mapToTable(model) {
        return sql`(${model.id}, ${model.serverId}, ${model.name}, ${model.rank}, ${model.isDefault})`
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(sql`select * from channel_groups`, filter);
    }

    mapFromTable(row) {
        return {
            id: row.id,
            serverId: row.server_id,
            name: row.name,
            rank: row.rank,
            isDefault: row.is_default,
        };
    }

    buildDeleteFromFilter(filter) {
        return this.sqlWithWhereClause(sql`delete from channel_groups`, filter);
    }

    sqlWithWhereClause(shrimple, filter) {
        const clauses = [];

        if (filter.filterId !== undefined) {
            clauses.push(sql`id = ${filter.filterId}`);
        }

        if(filter.filterServer !== undefined){
            clauses.push(sql`server_id = ${filter.filterServer}`);
        }

        if(filter.filterName !== undefined){
            clauses.push(sql`name = ${filter.filterName}`);
        }

        shrimple.appendMany(clauses, 'and', 'where');

        if(filter.ordering !== undefined) {
            shrimple.append`order by ${sql.raw(filter.ordering.column)} ${sql.raw(filter.ordering.direction)}`;
        }

        return shrimple;
    }

    async update(group){
        const setters = [];

        if(group.name !== undefined) {
            setters.push(sql`name = ${group.name}`);
        }

        if (setters.length === 0) {
            return;
        }

        const shrimple = sql`update channel_groups set`;

        shrimple.appendMany(setters, ',');

        shrimple.append`where id = ${group.id}`;

        await this.execute(shrimple);
    }

    async getBiggestRank(serverId) {
        const shrimple = sql`
                    select rank
                    from channel_groups
                    where server_id = ${serverId}`;

        shrimple.append`order by rank desc limit 1`;

        const result = await this.execute(shrimple);
        return result.rows.map(row => row.rank)[0] ?? null;
    }
}