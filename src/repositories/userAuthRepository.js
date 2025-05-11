import {logger} from "../utils/logger.js";
import {Sqlb} from "./_sqlb.js";
import {SqlRepository} from "./_sqlRepository.js";

export class UserAuthFilter {
    whereUserId(userId) {
        this.filterUserId = userId;
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
        const sqlb = new Sqlb('select * from user_auth where true');

        if (!!filter.filterUserId) {
            sqlb.add('and user_id = $userId', {userId: filter.filterUserId});
        }

        return sqlb;
    }

    mapFromTable(row) {
        switch (row.type) {
            case 'password':
                return {
                    id: row.id,
                    type: 'password',
                    details: {hash: row.details.hash},
                };
            default:
                throw new Error('Unreachable');
        }
    }
}