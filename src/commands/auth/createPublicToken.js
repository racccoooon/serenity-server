import * as jose from 'jose'
import {PRIVATE_KEY} from "../../utils/crypto.js";
import {UserSelector} from "../../domain/user.js";
import {config} from "../../config/settings.js";

export class CreatePublicTokenCommand {
    constructor(userId, publicKey) {
        this.userId = userId;
        this.publicKey = publicKey;
    }
}

export class CreatePublicTokenResponse{
    constructor(jwt) {
        this.jwt = jwt;
    }
}

export class CreatePublicTokenHandler {
    constructor(userDomainService) {
        this.userDomainService = userDomainService;
    }

    /**
     * @param  {CreatePublicTokenCommand} command
     * @returns {CreatePublicTokenResponse}
     */
    async handle(command) {
        if (!command) throw new Error('Command must be provided');

        const user = await this.userDomainService.findUser(new UserSelector(command.userId));

        const payload = {
            publicKey: command.publicKey,
            sub: command.userId.value,
            username: user.username.value,
            domain: config.server.domain,
        };

        const jwt = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'EdDSA' })
            .setIssuedAt()
            .setExpirationTime("5m")
            .sign(PRIVATE_KEY);

        return new CreatePublicTokenResponse(jwt);
    }
}