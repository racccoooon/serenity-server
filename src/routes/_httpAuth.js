import {AuthError} from "../errors/authError.js";
import {SessionFilter, SessionRepository} from "../repositories/sessionRepository.js";
import {createHash} from "crypto";
import {DateTime} from "luxon";
import {serenityClient} from "../client/index.js";
import {config} from "../config/settings.js";

export class AuthenticatedEntity {
    constructor(type) {
        this.type = type;
    }

    isLocalUser() {
        return this.type === 'local_user';
    }

    isRemoteUser() {
        return this.type === 'remote_user';
    }

    isRemoteInstance() {
        return this.type === 'remote_instance';
    }
}

const BEARER_PREFIX = "Bearer ";
const SESSION_TOKEN_PREFIX = "sessionToken_";
const UUID_BYTES_LENGTH = 36;

export async function authenticateEntity(request) {
    /** @type {import('../container').Scope} */
    const scope = request.scope;
    if (!scope) {
        throw new Error("Scope must be set on the request object. Is the fastify hook not working?")
    }

    const bearerToken = request.headers['authorization'];
    if (bearerToken) {
        if (!bearerToken.startsWith(BEARER_PREFIX)) {
            throw new AuthError();
        }

        const sessionToken = bearerToken.substring(BEARER_PREFIX.length);
        if (!sessionToken.startsWith(SESSION_TOKEN_PREFIX)) {
            throw new AuthError();
        }

        const sessionTokenData = Buffer.from(sessionToken.substring(SESSION_TOKEN_PREFIX.length), 'base64');
        if (sessionTokenData.length < UUID_BYTES_LENGTH) {
            throw new AuthError();
        }

        const sessionId = sessionTokenData.subarray(0, UUID_BYTES_LENGTH).toString();
        const secret = sessionTokenData.subarray(UUID_BYTES_LENGTH);

        const sessionRepo = scope.resolve(SessionRepository);
        const dbSession = await sessionRepo.first(new SessionFilter()
            .whereId(sessionId));
        if (!dbSession) {
            throw new AuthError();
        }

        if (DateTime.fromJSDate(dbSession.validUntil) < DateTime.now()) {
            throw new AuthError();
        }

        const hash = createHash('sha256');
        hash.update(secret);
        hash.update(dbSession.salt);
        const hashedSecret = hash.digest();

        if (Buffer.compare(hashedSecret, dbSession.hashedSecret) !== 0) {
            throw new AuthError();
        }

        const now = DateTime.now();
        await sessionRepo.updateUsageAndValidUntil(new SessionFilter()
            .whereId(sessionId));

        const authenticatedEntity = new AuthenticatedEntity('local_user');
        authenticatedEntity.id = dbSession.userId;
        authenticatedEntity.sessionId = dbSession.id;
        return authenticatedEntity;
    }

    const signature = request.headers['x-signature'];
    const certificate = request.headers['x-certificate'];
    if (signature && certificate) {
        //TODO: implement remote authentication + block list check
    }

    const domain = request.headers['x-instance'];
    if(signature && domain){
        if(config.environment !== 'Development'){
            let isValidDomain = false;
            try{
                isValidDomain = new URL(`https://${domain}`).hostname === domain;
            } catch{
                throw new AuthError();
            }
            if(!isValidDomain){
                throw new AuthError();
            }
        }

        // TODO: block list

        let protocol = "https://";
        if(config.environment === 'Development'){
            protocol = "http://";
        }

        const pubKey = await serenityClient.get(
            `${protocol}${domain}/.well-known/serenity/pubkey`
        );
        verifyRequestSignature(request, pubKey);

        const authenticatedEntity = new AuthenticatedEntity('remote_instance');
        authenticatedEntity.domain = domain;
        return authenticatedEntity;
    }

    throw new AuthError();
}

function verifyRequestSignature(request, pubKey){
    console.log(pubKey);
    console.log(request);

    //TODO implement this
}