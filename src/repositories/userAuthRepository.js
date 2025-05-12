import {logger} from "../utils/logger.js";
import {Sqlb} from "./_sqlb.js";
import {SqlRepository} from "./_sqlRepository.js";

export class UserAuthFilter {
    whereUserId(userId) {
        this.filterUserId = userId;
        return this;
    }

    whereType(type){
        this.filterType = type;
        return this;
    }
}

export class UserAuthRepository extends SqlRepository {
    get insertIntoSql() {
        return 'insert into user_auth (id, user_id, type, details)';
    }

    get insertRowSql() {
        return '($id, $userId, $type, $details)';
    }

    mapToTable(model) {
        return {
            id: model.id,
            userId: model.userId,
            type: model.type,
            details: model.details,
        };
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb('select * from user_auth'), filter);
    }

    sqlWithWhereClause(sqlb, filter){
        sqlb.add('where true');

        if (filter.filterUserId !== undefined) {
            sqlb.add('and user_id = $userId', {userId: filter.filterUserId});
        }

        if (filter.filterType !== undefined) {
            sqlb.add('and type = $type', {type: filter.filterType});
        }

        return sqlb;
    }

    mapFromTable(row) {
        return {
            id: row.id,
            type: 'password',
            details: row.details,
        };
    }
}