import {logger} from "../utils/logger.js";
import {chunked, isLastIndex} from "../utils/index.js";
import {Sqlb} from "./_sqlb.js";

export class SqlRepository {
    constructor(dbTransaction) {
        this.dbTransaction = dbTransaction;
    }

    async execute(sqlb) {
        const {sql, params} = sqlb.build();
        console.log(sql);
        logger.debug('Executing sql', sql);

        const tx = await this.dbTransaction.tx();
        return tx.query(sql, params);
    }

    get insertIntoSql() {
        throw new Error(`'insertIntoSql' must be overridden in child class ${this.constructor.name}.`);
    }

    toTableMapping(model) {
        throw new Error(`'mapModelToTable' must be overridden in child class ${this.constructor.name}.`);
    }

    async add(...models) {
        if (models.length === 0) return;

        for (let chunk of chunked(models)) {
            const sqlb = new Sqlb(this.insertIntoSql + " values");

            for (let i = 0; i < chunk.length; i++) {
                const model = chunk[i];

                const mapping = this.toTableMapping(model);
                sqlb.add(mapping.sql, mapping.value);

                if (!isLastIndex(i, chunk)) {
                    sqlb.add(",");
                }
            }

            await this.execute(sqlb);
        }
    }
}