import {handleRegisterUser} from "../users/registerUser.js";
import { jest } from '@jest/globals';
import {PasswordAuthentication} from "../../domain/auth.js";
import {User} from "../../domain/user.js";

test('register user without command', async () => {
    expect(handleRegisterUser()).rejects.toThrow('Command must be provided');
});

test('register user without user service', async () => {
    expect(handleRegisterUser({})).rejects.toThrow('User service must be provided');
});

test('register user without authentication method', async () => {
    const command = {authenticationMethods: []};
    expect(handleRegisterUser(command, {})).rejects.toThrow('Missing authentication method');
});


test('register user without authentication method', async () => {
    // arrange
    const command = {
        username: '<USER>',
        email: '<EMAIL>',
        authenticationMethods: [{ type: 'password', details: { password: '<PASSWORD>' }}]
    };
    const userService = {createUser: jest.fn()};

    // act
    const response = await handleRegisterUser(command, userService);

    // assert
    expect(userService.createUser).toHaveBeenCalledWith(new User('<USER>', '<EMAIL>')
        .withAuthentication(await PasswordAuthentication.fromPlain('<PASSWORD>')));
    expect(response).toEqual({ id: expect.any(String) });
});
