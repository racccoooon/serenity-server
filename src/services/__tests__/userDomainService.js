import {UserDomainService, createUserRequestModel, createPasswordRequestModel} from '../userDomainService';
import {User} from "../../domain/user.js";
import {PasswordAuthentication} from "../../domain/auth.js";
import { jest } from '@jest/globals';

test('create user with password', async () => {
    // arrange
    const authenticationMethod = await PasswordAuthentication.fromPlain("password");
    const user = new User("username", "email")
        .withAuthentication(authenticationMethod)

    const userRepository = {
        add: jest.fn(),
    };
    const userAuthRepository = {
        addPassword: jest.fn(),
    }

    const sut = new UserDomainService({
        userRepository,
        userAuthRepository,
    });

    // act
    await sut.createUser(user);

    // assert
    expect(userRepository.add).toHaveBeenCalledWith(createUserRequestModel(user));
    expect(userAuthRepository.addPassword).toHaveBeenCalledWith(createPasswordRequestModel(user.id, authenticationMethod));
})

test('create user requires at least one auth method', async () => {
    // arrange
    const user = new User("username", "email");

    const sut = new UserDomainService({userRepository: null, userAuthRepository: null});

    // act
    await expect(sut.createUser(user)).rejects.toThrow('User must have at least one authentication method');
})