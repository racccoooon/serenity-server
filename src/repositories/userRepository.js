import {Sqlb} from "./_sqlb.js";
import {SqlRepository} from "./_sqlRepository.js";

export class UserFilter {
    whereId(id) {
        this.filterId = id;
        return this;
    }

    whereUsername(username){
        this.filterUsername = username;
        return this;
    }
}

export class UserRepository extends SqlRepository {
    get insertIntoSql() {
        return 'insert into users (id, username, email, is_local)';
    }

    get insertRowSql() {
        return '($id, $username, $email, $isLocal)';
    }

    mapToTable(model) {
        return {
            id: model.id,
            username: model.username,
            email: model.email,
            isLocal: model.isLocal,
        };
    }

    buildSelectFromFilter(filter){
        return this.sqlWithWhereClause(new Sqlb('select * from users'), filter);
    }

    sqlWithWhereClause(sqlb, filter){
        sqlb.add('where true');

        if (filter.filterId !== undefined) {
            sqlb.add('and id = $id', {id: filter.filterId});
        }

        if (filter.filterUsername !== undefined) {
            sqlb.add(`and username = $username`, {username: filter.filterUsername});
        }

        return sqlb;
    }

    mapFromTable(row) {
        return {
            id: row.id,
            username: row.username,
            email: row.email,
            isLocal: row.is_local,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}