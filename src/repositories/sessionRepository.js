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

    buildSelectFromFilter(filter){
        return this.sqlWithWhereClause('select * from sessions', filter);
    }

    mapFromTable(row) {
        return {
            id: row.id,
            userId: row.user_id,
            salt: row.salt,
            hashedSecret: row.hashed_secret,
            validUntil: row.valid_until,
        };
    }

    buildDeteFromFilter(filter){
        return this.sqlWithWhereClause('delete from sessions', filter);
    }

    sqlWithWhereClause(sql, filter){
        const sqlb = new Sqlb(sql)
            .add('where true');

        if(!!filter.filterId){
            sqlb.add('and id = $id', {id: filter.filterId});
        }

        return sqlb;
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
}