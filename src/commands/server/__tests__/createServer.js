import { jest } from '@jest/globals';
import {CreateServerHandler} from "../createServer.js";
import {UserId} from "../../../domain/user.js";

test('create server', async () => {
    // arrange
    const serverService = {
        createServer: jest.fn(() => {}),
    };

    const command = {
        ownerId: UserId.gen(),
        name: "BeanServer",
    };

    const handler = new CreateServerHandler(serverService);

    // act
    const response = await handler.handle(command);

    // assert
    expect(serverService.createServer).toHaveBeenCalled();
    expect(response).not.toBe(null);
});