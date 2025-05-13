import { jest } from '@jest/globals';
import {CreateMessageCommand, CreateMessageHandler} from "../createMessage.js";

test('create text message', async () => {
    // arrange
    const command = new CreateMessageCommand();

    const messageRepo = {
        add: jest.fn(),
    };

    const handler = new CreateMessageHandler(messageRepo);

    // act
    handler.handle(command);

    // assert
    expect(messageRepo.add).toHaveBeenCalled();
})