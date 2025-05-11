import {logger} from "../utils/logger.js";
import {chunked, isLastIndex} from "../utils/index.js";
import {Sqlb} from "./_sqlb.js";
import {config} from "../config/settings.js";

export class SqlRepository {
    constructor(dbTransaction) {
        this.dbTransaction = dbTransaction;
    }

    async execute(sqlb) {
        const {sql, params} = sqlb.build();

        const meta = {sql: sql};
        if(config.logPii){
            meta.params = params;
        }

        logger.debug('Executing sql', meta);

        const tx = await this.dbTransaction.tx();
        return tx.query(sql, params);
    }

    get insertIntoSql() {
        throw new Error(`'insertIntoSql' must be overridden in child class.`);
    }

    get insertRowSql() {
        throw new Error(`'insertRowSql' must be overridden in child class.`);
    }

    mapToTable(model) {
        throw new Error(`'mapToTable' must be overridden in child class.`);
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
        throw new Error(`'buildSelectFromFilter' must be overridden in child class.`);
    }

    mapFromTable(row) {
        throw new Error(`'mapFromTable' must be overridden in child class.`);
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

    buildDeteFromFilter(filter){
        throw new Error(`'buildDeteFromFilter' must be overridden in child class.`);
    }

    async remove(filter) {
        const sqlb = this.buildDeteFromFilter(filter);
        const result = await this.execute(sqlb);
        return result.rowCount;
    }
}