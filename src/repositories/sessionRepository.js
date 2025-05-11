import {SqlRepository} from "./_sqlRepository.js";
import {Sqlb} from "./_sqlb.js";

export class SessionFilter {
    whereId(id){
        this.filterId = id;
        return this;
    }
}

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

    async first(filter) {
        const sqlb = new Sqlb('select * from sessions where true');

        if(!!filter.filterId){
            sqlb.add('and id = $id', {id: filter.filterId});
        }

        sqlb.add('limit 1');

        const result = await this.execute(sqlb);
        return result.rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            salt: row.salt,
            hashedSecret: row.hashed_secret,
            validUntil: row.valid_until,
        }))[0] ?? null;
    }

    async remove(id) {
        const tx = await this.dbTransaction.tx();
        await tx.query(`delete
                        from sessions
                        where id = $1;`,
            [id]);
    }
}