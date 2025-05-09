import {AuthDomainService, createSessionRequestModel} from "../authDomainService.js";
import {PasswordAuthentication} from "../../domain/auth.js";
import {UserId} from "../../domain/user.js";
import { jest } from '@jest/globals';
import {createUserRequestModel} from "../userDomainService.js";

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
            await PasswordAuthentication.fromPlain("bar"),
        ],
    };
    const authService = new AuthDomainService({sessionRepository: {}});
    let sessionToken = await authService.tryPasswordLogin(user, "foo");
    expect(sessionToken).toBe(null);
});

test('user with correct password issues a session token', async () => {
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