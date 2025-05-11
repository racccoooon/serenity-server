import {SqlRepository} from "./Repository.js";
import {chunked, isLastIndex} from "../utils/index.js";
import {Sqlb} from "./_sqlb.js";

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
}