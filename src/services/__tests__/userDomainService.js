import {UserDomainService, createUserRequestModel, createPasswordRequestModel} from '../userDomainService';
import {User, UserId, UserName, UserSelector} from "../../domain/user.js";
import {PasswordAuthentication} from "../../domain/auth.js";
import { jest } from '@jest/globals';

test('create user with password', async () => {
    // arrange
    const authenticationMethod = await PasswordAuthentication.fromPlain("password");
    const user = new User(new UserName("username"), "email")
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
    expect(userAuthRepository.addPassword).toHaveBeenCalledWith(user.id, createPasswordRequestModel(authenticationMethod));
})

test('create user requires at least one auth method', async () => {
    // arrange
    const user = new User(new UserName("username"), "email");

    const sut = new UserDomainService({userRepository: null, userAuthRepository: null});

    // act
    await expect(sut.createUser(user)).rejects.toThrow('User must have at least one authentication method');
})

test('find user with wrong or missing parameter', async () => {
    const sut = new UserDomainService({userRepository: null, userAuthRepository: null});
    await expect(sut.findUser()).rejects.toThrow('selector must be provided');
    await expect(sut.findUser(null)).rejects.toThrow('selector must be provided');
    await expect(sut.findUser(2)).rejects.toThrow('selector must be a UserSelector');
});

test('find nonexisting user', async () => {
    // arrange
    const userRepository = {
        find: jest.fn(() => null),
    };
    const sut = new UserDomainService({userRepository, userAuthRepository: null});

    // act
    const user = await sut.findUser(UserSelector.from("unknown-user"));

    // act
    expect(user).toBe(null);
});

test('find existing user', async () => {
    // arrange
    const userRepository = {
        find: jest.fn(() => ({
            id: "76f69c5f-3884-47c4-94d7-dff8f44270cf",
            username: "LittleBean",
            email: "bean@karo.gay",
        })),
    };
    const userAuthRepository = {
        byUserId: jest.fn(id => [
            {
                type: 'password',
                details: {
                    hash: 'foobar',
                },
            },
        ])
    };
    const sut = new UserDomainService({userRepository, userAuthRepository});

    // act
    const user = await sut.findUser(UserSelector.from("<UserName>"));

    // assert
    expect(user).toEqual(new User(new UserName("LittleBean"), "bean@karo.gay", new UserId("76f69c5f-3884-47c4-94d7-dff8f44270cf"))
        .withAuthentication(PasswordAuthentication.fromHash("<Hash>")));
});
