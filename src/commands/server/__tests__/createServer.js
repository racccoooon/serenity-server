import { jest } from '@jest/globals';
import {CreateServerHandler} from "../createServer.js";
import {UserId} from "../../../domain/user.js";
import {v4} from "uuid";

test('create server', async () => {
    // arrange
    const serverRepo = {
        add: jest.fn(() => {}),
    };
    const serverMemberRepo = {
        add: jest.fn(() => {}),
    };

    const command = {
        ownerId: v4(),
        name: "BeanServer",
    };

    const handler = new CreateServerHandler(
        serverRepo,
        serverMemberRepo);

    // act
    const response = await handler.handle(command);

    // assert
    expect(serverRepo.add).toHaveBeenCalled();
    expect(serverMemberRepo.add).toHaveBeenCalled();
    expect(response).not.toBe(null);
});