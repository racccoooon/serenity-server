export class CreateSessionModel {
    constructor(id, userId, salt, hashedSecret) {
        this.id = id;
        this.userId = userId;
        this.salt = salt;
        this.hashedSecret = hashedSecret;
    }
}