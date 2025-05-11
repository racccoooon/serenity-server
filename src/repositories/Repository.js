import {logger} from "../utils/logger.js";

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
}