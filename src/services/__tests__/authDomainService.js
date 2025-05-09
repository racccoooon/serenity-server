import {AuthDomainService} from "../authDomainService.js";
import {PasswordAuthentication} from "../../domain/auth.js";

test('user without password', async () => {
    const user = {
        authenticationMethods: [],
    };
    const authService = new AuthDomainService({sessionRepository: {}});
    let sessionToken = await authService.tryPasswordLogin(user, "foo");
    expect(sessionToken).toBe(null);
});

test('user with different password', async () => {
    const user = {
        authenticationMethods: [
            PasswordAuthentication.fromPlain("bar"),
        ],
    };
    const authService = new AuthDomainService({sessionRepository: {}});
    let sessionToken = await authService.tryPasswordLogin(user, "foo");
    expect(sessionToken).toBe(null);
});

test('user with correct password issues a session token', async () => {
    const user = {
        authenticationMethods: [
            await PasswordAuthentication.fromPlain("foo"),
        ],
    };
    const authService = new AuthDomainService({sessionRepository: {}});
    let sessionToken = await authService.tryPasswordLogin(user, "foo");
    expect(sessionToken).not.toBe(null);
});