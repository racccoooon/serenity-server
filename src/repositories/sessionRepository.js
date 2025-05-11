import {SqlRepository} from "./_sqlRepository.js";

export class SessionRepository extends SqlRepository {
    get insertIntoSql() {
        return 'insert into sessions (id, user_id, salt, hashed_secret, valid_until)';
    }

    get insertRowSql() {
        return '($id, $userId, $salt, $hashedSecret, $validUntil)';
    }

    mapToTable(model) {
        return {
            id: model.id,
            userId: model.userId,
            salt: model.salt,
            hashedSecret: model.hashedSecret,
            validUntil: model.validUntil,
        };
    }

    async updateUsageAndValidUntil(id, lastUsed, validUntil) {
        const tx = await this.dbTransaction.tx();
        await tx.query(`
                    update sessions
                    set last_used = $2,
                        valid_until = $3
                    where id = $1`,
            [id, lastUsed, validUntil]);
    }

    async find(id) {
        const tx = await this.dbTransaction.tx();
        const result = await tx.query(`select id, user_id, salt, hashed_secret, valid_until
                                       from sessions
                                       where id = $1`,
            [id]);

        const sessions = result.rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            salt: row.salt,
            hashedSecret: row.hashed_secret,
            validUntil: row.valid_until,
        }));

        if (sessions.length === 1) {
            return sessions[0];
        }

        return null;
    }

    async remove(id) {
        const tx = await this.dbTransaction.tx();
        await tx.query(`delete
                        from sessions
                        where id = $1;`,
            [id]);
    }
}