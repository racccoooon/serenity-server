import {CreateChannelCommand, CreateChannelHandler} from "../createChannel.js";
import {v4} from "uuid";
import {jest} from '@jest/globals';

test('creates channel and in group', async () => {
    // arrange
    const command = new CreateChannelCommand(v4(), v4(), "name");

    const channelRepo = {
        getBiggestRank: jest.fn(() => null),
        add: jest.fn(),
    }

    const handler = new CreateChannelHandler(channelRepo);

    // act
    await handler.handle(command);

    // assert
    expect(channelRepo.getBiggestRank).toHaveBeenCalled();
    expect(channelRepo.add).toHaveBeenCalled();
});