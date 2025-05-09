import { PasswordLoginCommand, PasswordLoginHandler} from "../auth/passwordLogin.js";
import { jest } from '@jest/globals';
import {AuthorizationError} from "../../errors/authorizationError.js";

test('Login user without command', async () => {
    const handler = new PasswordLoginHandler();
    expect(handler.handle()).rejects.toThrow('Command must be provided');
});

test('Login unknown user', async () => {
    // arrange
    const userService = {
        findUser: jest.fn(() => null),
    }

    const command = {
        username: "UnknownBean",
        password: "<Password>",
    };

    const handler = new PasswordLoginHandler(userService);

    // act
    expect(handler.handle(command)).rejects.toThrow(AuthorizationError)
});

test('Login wrong password', async () => {
    // arrange
    const userService = {
        findUser: jest.fn(() => ({})),
    };

    const authService = {
        tryPasswordLogin: jest.fn(() => false),
    };

    const command = {
        username: "UnknownBean",
        password: "<Password>",
    };

    const handler = new PasswordLoginHandler(userService, authService);

    // act
    expect(handler.handle(command)).rejects.toThrow(AuthorizationError)
});

test('Login correct user and password', async () => {
    // arrange
    const userService = {
        findUser: jest.fn(() => ({})),
    };

    const authService = {
        tryPasswordLogin: jest.fn(() => "session"),
    };

    const command = {
        username: "UnknownBean",
        password: "<Password>",
    };

    const handler = new PasswordLoginHandler(userService, authService);

    // act
    const response = await handler.handle(command);

    // assert
    expect(response.sessionToken).toStrictEqual("session");
});