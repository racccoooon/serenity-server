import {AuthorizationError, PasswordLoginCommand, PasswordLoginHandler} from "../auth/passwordLogin.js";
import { jest } from '@jest/globals';

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
    };

    const handler = new PasswordLoginHandler(userService);

    // act
    expect(handler.handle(command)).rejects.toThrow(AuthorizationError)
});