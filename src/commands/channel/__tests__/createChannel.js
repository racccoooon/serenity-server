import {CreateChannelCommand, CreateChannelHandler} from "../createChannel.js";
import {v4} from "uuid";
import {jest} from '@jest/globals';

test('creates channel and in group', async () => {
    // arrange
    const serverId = v4();
    const command = new CreateChannelCommand(serverId, v4(), "name");

    const channelGroupRepo = {
        first: jest.fn(() => ({serverId: serverId})),
    }

    const channelRepo = {
        getBiggestRank: jest.fn(() => null),
        add: jest.fn(),
    }

    const handler = new CreateChannelHandler(channelGroupRepo, channelRepo);

    // act
    await handler.handle(command);

    // assert
    expect(channelRepo.getBiggestRank).toHaveBeenCalled();
    expect(channelRepo.add).toHaveBeenCalled();
});