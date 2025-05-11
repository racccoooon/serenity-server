import {RegisterUserHandler} from "../auth/registerUser.js";
import { jest } from '@jest/globals';

test('Register user without command', async () => {
    const handler = new RegisterUserHandler();
    expect(handler.handle()).rejects.toThrow('Command must be provided');
});

test('Register user without authentication method', async () => {
    const command = {authenticationMethods: []};
    const handler = new RegisterUserHandler({});
    expect(handler.handle(command)).rejects.toThrow('Missing authentication method');
});


test('Register user', async () => {
    // arrange
    const command = {
        username: '<USER>',
        email: '<EMAIL>',
        authenticationMethods: [{ type: 'password', details: { password: '<PASSWORD>' }}]
    };

    const userRepo = {
        add: jest.fn(),
    };
    const userAuthRepo = {
        add: jest.fn(),
    };

    const handler = new RegisterUserHandler(userRepo, userAuthRepo);

    // act
    const _ = await handler.handle(command);

    // assert
    expect(userRepo.add).toHaveBeenCalled();
    expect(userAuthRepo.add).toHaveBeenCalled();
});
