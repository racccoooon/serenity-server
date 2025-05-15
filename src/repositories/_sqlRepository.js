import {logger} from "../utils/logger.js";
import {chunked, isLastIndex} from "../utils/index.js";
import {Sqlb} from "./_sqlb.js";
import {config} from "../config/settings.js";
import {sql} from "./_shrimple.js";

export class SqlRepository {
    constructor(dbTransaction) {
        this.dbTransaction = dbTransaction;
    }

    /**
     * @param {ShrimpleSql} shrimple
     */
    async execute(shrimple) {
        const {sql, params} = shrimple.build();

        const meta = {sql: sql};
        if(config.logPii){
            meta.params = params;
        }

        logger.debug('Executing sql', meta);

        const tx = await this.dbTransaction.tx();
        return tx.query(sql, params);
    }

    /**
     * @return {ShrimpleSql}
     */
    get insertIntoSql() {
        throw new Error(`'insertIntoSql' must be overridden in child class.`);
    }

    /**
     * @return {ShrimpleSql}
     */
    mapToTable(model) {
        throw new Error(`'mapToTable' must be overridden in child class.`);
    }

    async add(...models) {
        if (models.length === 0) return;

        for (let chunk of chunked(models)) {
            const shrimple = this.insertIntoSql.clone();

            const valuesList = chunk.map(x => this.mapToTable(x));
            shrimple.appendMany(valuesList, ',', 'values');

            await this.execute(shrimple);
        }
    }

    /**
     * @return {ShrimpleSql}
     */
    buildSelectFromFilter(filter){
        throw new Error(`'buildSelectFromFilter' must be overridden in child class.`);
    }

    /**
     * @return {ShrimpleSql}
     */
    mapFromTable(row) {
        throw new Error(`'mapFromTable' must be overridden in child class.`);
    }

    async first(filter){
        const shrimple = this.buildSelectFromFilter(filter);
        shrimple.append`limit 1`;
        const result = await this.execute(shrimple);
        return result.rows.map(this.mapFromTable)[0] ?? null;
    }

    async list(filter) {
        const shrimple = this.buildSelectFromFilter(filter);
        const result = await this.execute(shrimple);
        return result.rows.map(this.mapFromTable);
    }

    buildDeleteFromFilter(filter){
        throw new Error(`'buildDeleteFromFilter' must be overridden in child class.`);
    }

    async remove(filter) {
        const shrimple = this.buildDeleteFromFilter(filter);
        const result = await this.execute(shrimple);
        return result.rowCount;
    }
}