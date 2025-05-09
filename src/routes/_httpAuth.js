import {AuthorizationError} from "../errors/authorizationError.js";
import {container} from "../app.js";
import {SessionRepository} from "../repositories/sessionRepository.js";
import {createHash} from "crypto";

export class AuthenticatedEntity {
    constructor(type, id) {
        this.type = type;
        this.id = id;
    }

    isLocalUser() {
        return this.type === 'local_user';
    }
}

export async function getHttpAuthStrategy(headers){
    const bearerToken = headers['authorization'];
    if(bearerToken){
        if(!bearerToken.startsWith("Bearer ")){
            throw new AuthorizationError();
        }

        const sessionToken = bearerToken.substring(7);
        if(!sessionToken.startsWith("sessionToken_")){
            throw new AuthorizationError();
        }

        const sessionDataBase64 = Buffer.from(sessionToken.substring(13), 'base64');
        if(sessionDataBase64.length < 16){
            throw new AuthorizationError();
        }

        const sessionId = sessionDataBase64.subarray(0, 36).toString();
        const secret = sessionDataBase64.subarray(36);

        const sessionRepo = container.resolve(SessionRepository);
        const dbSession = await sessionRepo.find(sessionId);
        if(!dbSession){
            throw new AuthorizationError();
        }

        const hash = createHash('sha256');
        hash.update(secret);
        hash.update(dbSession.salt);
        const hashedSecret = hash.digest();

        if(Buffer.compare(hashedSecret, dbSession.hashedSecret) !== 0){
            throw new AuthorizationError();
        }

        return new AuthenticatedEntity('local_user', dbSession.userId);
    }

    throw new AuthorizationError();
}