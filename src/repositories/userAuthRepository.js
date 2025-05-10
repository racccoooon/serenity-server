import {logger} from "../utils/logger.js";
import {Sqlb} from "./_sqlb.js";

export class AuthMethodModel {
    constructor(id, type, details) {
        this.id = id;
        this.type = type;
        this.details = details;
    }
}

export class PasswordAuthDetailsModel {
    constructor(hash) {
        this.hash = hash;
    }
}

export class UserAuthRepository {
    constructor(dbTransaction) {
        this.dbTransaction = dbTransaction;
    }

    /**
     * @param {import('../domain/user.js').UserId} userId
     * @param {AuthMethodModel} authMethod
     * @returns {Promise<void>}
     */
    async addPassword(userId, authMethod) {
        const tx = await this.dbTransaction.tx();
        await tx.query(`
            insert into user_auth (id, user_id, type, details)
            values ($1, $2, $3, $4);`,
            [authMethod.id, userId, 'password', authMethod.details]);
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
                    return new AuthMethodModel(
                        row.id,
                        'password',
                        new PasswordAuthDetailsModel(row.details.hash)
                    );
                default:
                    throw new Error('Unreachable');
            }
        });
    }
}