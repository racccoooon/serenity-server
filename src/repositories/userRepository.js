import {UserId, UserName} from "../domain/user.js";
import {logger} from "../utils/logger.js";
import {Sqlb} from "./_sqlb.js";
import {SqlRepository} from "./_sqlRepository.js";
import {chunked, isLastIndex} from "../utils/index.js";

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
        return 'insert into users (id, username, email)';
    }

    get insertRowSql() {
        return '($id, $username, $email)';
    }

    mapToTable(model) {
        return {
            id: model.id,
            username: model.username,
            email: model.email,
        };
    }

    buildSelectFromFilter(filter){
        return this.sqlWithWhereClause(new Sqlb('select * from users'), filter);
    }

    sqlWithWhereClause(sqlb, filter){
        sqlb.add('where true');

        if (!!filter.filterId) {
            sqlb.add('and id = $id', {id: filter.filterId});
        }

        return sqlb;
    }

    mapFromTable(row) {
        return {
            id: row.id,
            username: row.username,
            email: row.email,
        };
    }
}