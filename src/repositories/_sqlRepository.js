import {logger} from "../utils/logger.js";
import {chunked, isLastIndex} from "../utils/index.js";
import {Sqlb} from "./_sqlb.js";

export class SqlRepository {
    constructor(dbTransaction) {
        this.dbTransaction = dbTransaction;
    }

    async execute(sqlb) {
        const {sql, params} = sqlb.build();
        logger.debug('Executing sql', sql);

        const tx = await this.dbTransaction.tx();
        return tx.query(sql, params);
    }

    get insertIntoSql() {
        throw new Error(`'insertIntoSql' must be overridden in child class ${this.constructor.name}.`);
    }

    get insertRowSql() {
        throw new Error(`'insertRowSql' must be overridden in child class ${this.constructor.name}.`);
    }

    mapToTable(model) {
        throw new Error(`'mapToTable' must be overridden in child class ${this.constructor.name}.`);
    }

    async add(...models) {
        if (models.length === 0) return;

        const insertRowSql = this.insertRowSql;

        for (let chunk of chunked(models)) {
            const sqlb = new Sqlb(this.insertIntoSql + " values");

            for (let i = 0; i < chunk.length; i++) {
                sqlb.add(insertRowSql, this.mapToTable(chunk[i]));
                if (!isLastIndex(i, chunk)) {
                    sqlb.add(",");
                }
            }

            await this.execute(sqlb);
        }
    }

    buildSelectFromFilter(filter){
        throw new Error(`'buildSelectFromFilter' must be overridden in child class ${this.constructor.name}.`);
    }

    mapFromTable(row) {
        throw new Error(`'mapFromTable' must be overridden in child class ${this.constructor.name}.`);
    }

    async first(filter){
        const sqlb = this.buildSelectFromFilter(filter);
        const result = await this.execute(sqlb);
        return result.rows.map(this.mapFromTable)[0] ?? null;
    }

    async list(filter) {
        const sqlb = this.buildSelectFromFilter(filter);
        const result = await this.execute(sqlb);
        return result.rows.map(this.mapFromTable);
    }
}