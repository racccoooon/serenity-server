export class SessionModel {
    constructor(id, userId, salt, hashedSecret, validUntil) {
        this.id = id;
        this.userId = userId;
        this.salt = salt;
        this.hashedSecret = hashedSecret;
        this.validUntil = validUntil;
    }
}

export class SessionRepository {
    constructor(dbTransaction) {
        this.dbTransaction = dbTransaction;
    }

    /**
     * @param {SessionModel} param
     * @returns {Promise<void>}
     */
    async add(param) {
        const tx = await this.dbTransaction.tx();
        await tx.query(`
            insert into sessions(id, user_id, salt, hashed_secret, valid_until)
            values ($1, $2, $3, $4, $5);`,
            [param.id, param.userId, param.salt, param.hashedSecret, param.validUntil]);
    }

    async updateUsageAndValidUntil(id, lastUsed, validUntil){
        const tx = await this.dbTransaction.tx();
        await tx.query(`
            update sessions
            set last_used = $2, valid_until = $3
            where id = $1`,
            [id, lastUsed, validUntil]);
    }

    async find(id) {
        const tx = await this.dbTransaction.tx();
        const result = await tx.query(`select id, user_id, salt, hashed_secret, valid_until
                    from sessions
                    where id = $1`,
            [id]);

        const sessions = result.rows.map(row => new SessionModel(
            row.id,
            row.user_id,
            row.salt,
            row.hashed_secret,
            row.valid_until,
        ));

        if(sessions.length === 1){
            return sessions[0];
        }

        return null;
    }

    async remove(id) {
        const tx = await this.dbTransaction.tx();
        await tx.query(`delete from sessions where id = $1;`,
            [id]);
    }
}