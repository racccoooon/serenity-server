import {AuthError} from "../errors/authError.js";
import {SessionRepository} from "../repositories/sessionRepository.js";
import {createHash} from "crypto";
import {UserId} from "../domain/user.js";
import {DateTime} from "luxon";
import {Session, SessionId} from "../domain/session.js";

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

export async function authenticateEntity(request){
    /** @type {import('../container').Scope} */
    const scope = request.scope;
    if(!scope){
        throw new Error("Scope must be set on the request object. Is the fastify hook not working?")
    }

    const bearerToken = request.headers['authorization'];
    if(bearerToken){
        if(!bearerToken.startsWith(BEARER_PREFIX)){
            throw new AuthError();
        }

        const sessionToken = bearerToken.substring(BEARER_PREFIX.length);
        if(!sessionToken.startsWith(SESSION_TOKEN_PREFIX)){
            throw new AuthError();
        }

        const sessionTokenData = Buffer.from(sessionToken.substring(SESSION_TOKEN_PREFIX.length), 'base64');
        if(sessionTokenData.length < UUID_BYTES_LENGTH){
            throw new AuthError();
        }

        const sessionId = sessionTokenData.subarray(0, UUID_BYTES_LENGTH).toString();
        const secret = sessionTokenData.subarray(UUID_BYTES_LENGTH);

        const sessionRepo = scope.resolve(SessionRepository);
        const dbSession = await sessionRepo.find(sessionId);
        if(!dbSession){
            throw new AuthError();
        }

        if(DateTime.fromJSDate(dbSession.validUntil) < DateTime.now()){
            throw new AuthError();
        }

        const hash = createHash('sha256');
        hash.update(secret);
        hash.update(dbSession.salt);
        const hashedSecret = hash.digest();

        if(Buffer.compare(hashedSecret, dbSession.hashedSecret) !== 0){
            throw new AuthError();
        }

        const now = DateTime.now();
        await sessionRepo.updateUsageAndValidUntil(
            sessionId,
            now,
            now.plus({days: 7}));

        const authenticatedEntity = new AuthenticatedEntity('local_user', new UserId(dbSession.userId));
        authenticatedEntity.sessionId = new SessionId(dbSession.id);
        return authenticatedEntity;
    }

    const signature = headers['x-signature'];
    const certificate = headers['x-certificate'];
    if(signature && certificate){
        //TODO: implement remote authentication + block list check
    }

    throw new AuthError();
}