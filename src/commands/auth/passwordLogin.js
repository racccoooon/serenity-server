import {AuthError} from "../../errors/authError.js";
import {UserFilter} from "../../repositories/userRepository.js";
import {UserAuthFilter} from "../../repositories/userAuthRepository.js";
import bcrypt from "bcryptjs";
import {createHash, randomBytes} from "crypto";
import {v4} from "uuid";

export class PasswordLoginCommand {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

export class LoginResponse {
    constructor(sessionToken) {
        this.sessionToken = sessionToken;
    }
}

export class PasswordLoginHandler {
    constructor(userRepository, userAuthRepository, sessionRepository) {
        this.userRepository = userRepository;
        this.userAuthRepository = userAuthRepository;
        this.sessionRepository = sessionRepository;
    }

    handle = async (command) => {
        if (!command) throw new Error('Command must be provided');

        const user = await this.userRepository.first(new UserFilter()
            .whereUsername(command.username));
        if (!user) throw new AuthError();

        const passwords = await this.userAuthRepository.list(new UserAuthFilter()
            .whereUserId(user.id)
            .whereType('password'));
        if (passwords.length === 0) throw new AuthError();

        let found = false;
        for (let password of passwords) {
            if (await bcrypt.compare(command.password, password.details.hash)) {
                found = true;
                break;
            }
        }
        if (!found) throw new AuthError();

        const salt = randomBytes(16);
        const secret = randomBytes(16);

        const hash = createHash('sha256');
        hash.update(secret);
        hash.update(salt);
        const hashedSecret = hash.digest();

        const session = {
            id: v4(),
            userId: user.id,
            salt: salt,
            hashedSecret: hashedSecret
        };
        await this.sessionRepository.add(session);

        const sessionToken = formatSessionToken(session.id, secret);
        return new LoginResponse(sessionToken);
    }
}

function formatSessionToken(id, secret){
    const buf = Buffer.from(id);
    const combinedBuffer = Buffer.concat([buf, secret]);
    return `sessionToken_${combinedBuffer.toString('base64')}`;
}