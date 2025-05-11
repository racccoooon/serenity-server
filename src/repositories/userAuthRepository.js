import {logger} from "../utils/logger.js";
import {Sqlb} from "./_sqlb.js";
import {SqlRepository} from "./Repository.js";

export class UserAuthRepository extends SqlRepository{
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

    /**
     *
     * @param {import('../domain/user.js').UserId} userId
     * @returns {Promise<AuthMethodModel[]>}
     */
    async byUserId(userId) {
        let sqlb = new Sqlb(
            `select id, type, details from user_auth where`
        );

        sqlb.add('user_id = $userId', {userId: userId});

        const {sql, params} = sqlb.build();
        logger.debug(`executing sql: ${sql}`);
        const tx = await this.dbTransaction.tx();
        const result = await tx.query(sql, params);

        return result.rows.map(row => {
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
        });
    }
}