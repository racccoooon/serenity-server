import {SqlRepository} from "./Repository.js";
import {chunked, isLastIndex} from "../utils/index.js";
import {Sqlb} from "./_sqlb.js";

export class ServerRepository extends SqlRepository {
    async add(...servers) {
        if(servers.length === 0) return;

        for (let chunk of chunked(servers)) {
            const sqlb = new Sqlb('insert into servers (id, owner_id, name, description) values');

            for (let i = 0; i < chunk.length; i++) {
                const server = chunk[i];

                sqlb.add('($id, $ownerId, $name, $description)', {
                    id: server.id,
                    ownerId: server.ownerId,
                    name: server.name,
                    description: server.description,
                });

                if (!isLastIndex(i, chunk)) {
                    sqlb.add(",");
                }
            }

            await this.execute(sqlb);
        }
    }
}