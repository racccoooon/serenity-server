import {SqlRepository} from "./_sqlRepository.js";
import {Sqlb} from "./_sqlb.js";

export class ServerFilter{
    whereIsMember(userId){
        this.filterIsMember = userId;
        return this;
    }
}

export class ServerRepository extends SqlRepository {
    get insertIntoSql() {
        return 'insert into servers (id, owner_id, name, description)';
    }

    get insertRowSql() {
        return '($id, $ownerId, $name, $description)';
    }

    mapToTable(model) {
        return {
            id: model.id,
            ownerId: model.ownerId,
            name: model.name,
            description: model.description,
        };
    }

    sqlWithWhereClause(sqlb, filter) {
        sqlb.add('where true');

        if (filter.filterIsMember !== undefined) {
            sqlb.add(`and exists (select true from server_members where server_id = servers.id and user_id = $userId)`, {userId: filter.filterIsMember});
        }

        return sqlb;
    }

    buildSelectFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb('select * from servers'), filter);
    }

    mapFromTable(row) {
        return {
            id: row.id,
            ownerId: row.owner_id,
            name: row.name,
            description: row.description,
        };
    }

    buildDeleteFromFilter(filter) {
        return this.sqlWithWhereClause(new Sqlb(`delete from servers`), filter);
    }
}