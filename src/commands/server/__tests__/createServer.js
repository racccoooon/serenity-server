import { jest } from '@jest/globals';
import {CreateServerHandler} from "../createServer.js";

test('create server', async () => {
    // arrange
    const serverService = {
        createServer: jest.fn(() => {}),
    };

    const command = {
        name: "BeanServer",
    };

    const handler = new CreateServerHandler(serverService);

    // act
    const response = await handler.handle(command);

    // assert
    expect(serverService.createServer).toHaveBeenCalled();
    expect(response).not.toBe(null);
});