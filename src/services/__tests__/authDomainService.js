import {AuthDomainService, createSessionRequestModel} from "../authDomainService.js";
import {PasswordAuthentication} from "../../domain/auth.js";
import {UserId} from "../../domain/user.js";
import {jest} from '@jest/globals';
import {createUserRequestModel} from "../userDomainService.js";
import {SessionId} from "../../domain/session.js";

test('login user without password', async () => {
    const user = {
        authenticationMethods: [],
    };
    const authService = new AuthDomainService({sessionRepository: {}});
    let sessionToken = await authService.tryPasswordLogin(user, "foo");
    expect(sessionToken).toBe(null);
});

test('login user with wrong password', async () => {
    const user = {
        authenticationMethods: [
            await PasswordAuthentication.fromPlain("bar"),
        ],
    };
    const authService = new AuthDomainService({sessionRepository: {}});
    let sessionToken = await authService.tryPasswordLogin(user, "foo");
    expect(sessionToken).toBe(null);
});

test('login user with correct password issues a session token', async () => {
    // arrange
    const user = {
        id: UserId.gen(),
        authenticationMethods: [
            await PasswordAuthentication.fromPlain("foo"),
        ],
    };

    const sessionRepository = {
        add: jest.fn(),
    };

    const authService = new AuthDomainService({sessionRepository});

    // act
    let sessionToken = await authService.tryPasswordLogin(user, "foo");

    // assert
    expect(sessionToken).not.toBe(null);
    expect(sessionRepository.add).toHaveBeenCalled();
});

test('logout', async () => {
    // arrange
    const sessionRepository = {
        remove: jest.fn(),
    };

    const authService = new AuthDomainService({sessionRepository})

    // act
    await authService.logout(SessionId.gen());

    // assert
    expect(sessionRepository.remove).toHaveBeenCalled();
});