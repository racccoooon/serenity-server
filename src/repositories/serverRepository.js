export class ServerModel {
    constructor(id, ownerId, name, description) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.description = description;
    }
}

export class ServerRepository {
    /**
     * @param {ServerModel} model
     * @returns {Promise<void>}
     */
    async add(model) {
        const tx = await this.dbTransaction.tx();
        await tx.query(`
                    insert into servers (id, owner_id, name, description)
                    values ($1, $2, $3, $4);`,
            [model.id, model.ownerId, model.name, model.description]);
    }
}