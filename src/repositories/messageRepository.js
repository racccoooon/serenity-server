import {SqlRepository} from "./_sqlRepository.js";

export class MessageFilter {
    whereChannel(channelId) {
        this.filterChannel = channelId;
        return this;
    }
}

export class MessageRepository extends SqlRepository{
    get insertIntoSql() {
        return `insert into messages (id, channel_id, user_id, type, details)`;
    }

    get insertRowSql() {
        return `($id, $channelId, $userId, $type, $details)`;
    }

    mapToTable(model) {
        return {
            id: model.id,
            channelId: model.channelId,
            userId: model.userId,
            type: model.type,
            details: model.details,
        };
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb(`select * from messages`), filter);
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
        return this.buildSelectFromFilter(new Sqlb(`delete from messages`), filter);
    }

    sqlWithWhereClause(sqlb, filter) {
        sqlb.add(`where true`);

        if(filter.filterChannel !== undefined){
            sqlb.add(`and channel_id = $channelId`, { channelId: filter.filterChannel});
        }

        return sqlb;
    }
}
