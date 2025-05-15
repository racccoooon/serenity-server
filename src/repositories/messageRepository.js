import {SqlRepository} from "./_sqlRepository.js";
import {sql} from "./_shrimple.js";

export class MessageFilter {
    whereChannel(channelId) {
        this.filterChannel = channelId;
        return this;
    }
}

export class MessageRepository extends SqlRepository{
    get insertIntoSql() {
        return sql`insert into messages (id, channel_id, user_id, type, details)`;
    }

    mapToTable(model) {
        return sql`(${model.id}, ${model.channelId}, ${model.userId}, ${model.type}, ${model.details})`;
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(sql`select * from messages`, filter);
    }

    mapFromTable(row) {
        return {
            id: row.id,
            channelId: row.channel_id,
            userId: row.user_id,
            type: row.type,
            details: row.details,
        };
    }

    buildDeleteFromFilter(filter) {
        return this.buildSelectFromFilter(sql`delete from messages`, filter);
    }

    sqlWithWhereClause(shrimple, filter) {
        const clauses = [];

        if(filter.filterChannel !== undefined){
            clauses.push(sql`channel_id = ${filter.filterChannel}`);
        }

        shrimple.appendMany(clauses, 'and', 'where');
        return shrimple;
    }
}
