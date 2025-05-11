import {CreatePublicTokenHandler, CreatePublicTokenResponse} from "../createPublicToken.js";
import { jest } from '@jest/globals';
import {v4} from "uuid";

test('create jwt and sign it', async () => {
    // arrange
    const command = {
        userId: v4(),
        publicKey:
            `-----BEGIN PUBLIC KEY-----
                MCowBQYDK2VwAyEARXSQpJzQ65Tub7lwMBZhaWjI2lVsZF+gtKnroGTg6OI=
                -----END PUBLIC KEY-----`,
    }

    const userRepo = {
        first: jest.fn(() => ({
            username: "Bean27",
        })),
    };

    const handler = new CreatePublicTokenHandler(userRepo);

    // act
    const response = await handler.handle(command);

    // assert
    expect(userRepo.first).toHaveBeenCalled();
    expect(response).toBeInstanceOf(CreatePublicTokenResponse);
})
