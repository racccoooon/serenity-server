import {AuthorizationError} from "../errors/authorizationError.js";
import {container} from "../app.js";
import {SessionRepository} from "../repositories/sessionRepository.js";
import {createHash} from "crypto";
import {UserId} from "../domain/user.js";

export class AuthenticatedEntity {
    constructor(type, id) {
        this.type = type;
        this.id = id;
    }

    isLocalUser() {
        return this.type === 'local_user';
    }

    isRemoteUser() {
        return this.type === 'remote_user';
    }
}

const BEARER_PREFIX = "Bearer ";
const SESSION_TOKEN_PREFIX = "sessionToken_";
const UUID_BYTES_LENGTH = 36;

export async function getHttpAuthStrategy(headers){
    const bearerToken = headers['authorization'];
    if(bearerToken){
        if(!bearerToken.startsWith(BEARER_PREFIX)){
            throw new AuthorizationError();
        }

        const sessionToken = bearerToken.substring(BEARER_PREFIX.length);
        if(!sessionToken.startsWith(SESSION_TOKEN_PREFIX)){
            throw new AuthorizationError();
        }

        const sessionTokenData = Buffer.from(sessionToken.substring(SESSION_TOKEN_PREFIX.length), 'base64');
        if(sessionTokenData.length < UUID_BYTES_LENGTH){
            throw new AuthorizationError();
        }

        const sessionId = sessionTokenData.subarray(0, UUID_BYTES_LENGTH).toString();
        const secret = sessionTokenData.subarray(UUID_BYTES_LENGTH);

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

        return new AuthenticatedEntity('local_user', new UserId(dbSession.userId));
    }

    const signature = headers['x-signature'];
    const certificate = headers['x-certificate'];
    if(signature && certificate){
        //TODO: implement remote authentication + block list check
    }

    throw new AuthorizationError();
}