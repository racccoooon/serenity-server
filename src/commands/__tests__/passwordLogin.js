import { PasswordLoginCommand, PasswordLoginHandler} from "../auth/passwordLogin.js";
import { jest } from '@jest/globals';
import {AuthError} from "../../errors/authError.js";

test('Login user without command', async () => {
    const handler = new PasswordLoginHandler();
    expect(handler.handle()).rejects.toThrow('Command must be provided');
});

test('Login unknown user', async () => {
    // arrange
    const userRepo = {
        first: jest.fn(() => null),
    }

    const command = {
        username: "UnknownBean",
        password: "<Password>",
    };

    const handler = new PasswordLoginHandler(userRepo);

    // act
    expect(handler.handle(command)).rejects.toThrow(AuthError)
});

test('Login wrong password', async () => {
    // arrange
    const userRepo = {
        first: jest.fn(() => ({})),
    };

    const userAuthRepo = {
        list: jest.fn(() => []),
    };

    const command = {
        username: "UnknownBean",
        password: "<Password>",
    };

    const handler = new PasswordLoginHandler(userRepo, userAuthRepo);

    // act
    expect(handler.handle(command)).rejects.toThrow(AuthError)
});

test('Login correct user and password', async () => {
    // arrange
    const userRepo = {
        first: jest.fn(() => ({})),
    };

    const userAuthRepo = {
        list: jest.fn(() => [{details: {hash: "$2b$12$xof/3FKOl2LCmu7e6Vig8.kKi1hdRNm7YOvdG9I8yGAn8r9lSUHPK"}}]),
    };

    const sessionRepo = {
        add: jest.fn(),
    };

    const command = {
        username: "UnknownBean",
        password: "secretbean!",
    };

    const handler = new PasswordLoginHandler(userRepo, userAuthRepo, sessionRepo);

    // act
    const response = await handler.handle(command);

    // assert
    expect(response.sessionToken).not.toBe(null);
    expect(sessionRepo.add).toHaveBeenCalled();
});