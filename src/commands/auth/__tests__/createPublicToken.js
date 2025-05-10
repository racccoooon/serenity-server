import {CreatePublicTokenHandler, CreatePublicTokenResponse} from "../createPublicToken.js";
import {UserId} from "../../../domain/user.js";
import { jest } from '@jest/globals';

test('create jwt and sign it', async () => {
    // arrange
    const command = {
        userId: UserId.gen(),
        publicKey:
            `-----BEGIN PUBLIC KEY-----
                MCowBQYDK2VwAyEARXSQpJzQ65Tub7lwMBZhaWjI2lVsZF+gtKnroGTg6OI=
                -----END PUBLIC KEY-----`,
    }

    const userService = {
        findUser: jest.fn(() => ({
            username: "Bean27",
        })),
    };

    const handler = new CreatePublicTokenHandler(userService);

    // act
    const response = await handler.handle(command);

    // assert
    expect(userService.findUser).toHaveBeenCalled();
    expect(response).toBeInstanceOf(CreatePublicTokenResponse);
})
