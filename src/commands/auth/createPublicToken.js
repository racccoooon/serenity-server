import * as jose from 'jose'
import {PRIVATE_KEY} from "../../utils/crypto.js";
import {config} from "../../config/settings.js";
import {UserFilter} from "../../repositories/userRepository.js";

export class CreatePublicTokenCommand {
    constructor(userId, publicKey) {
        this.userId = userId;
        this.publicKey = publicKey;
    }
}

export class CreatePublicTokenResponse {
    constructor(jwt) {
        this.jwt = jwt;
    }
}

export class CreatePublicTokenHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * @param  {CreatePublicTokenCommand} command
     * @returns {CreatePublicTokenResponse}
     */
    async handle(command) {
        if (!command) throw new Error('Command must be provided');

        const user = await this.userRepository.first(new UserFilter()
            .whereId(command.userId));

        const payload = {
            publicKey: command.publicKey,
            sub: command.userId,
            username: user.username,
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
