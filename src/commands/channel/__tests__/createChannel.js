import {CreateChannelCommand, CreateChannelHandler} from "../createChannel.js";
import {v4} from "uuid";
import { jest } from '@jest/globals';

test('creates channel', async () => {
   // arrange
   const command = new CreateChannelCommand(v4(), "name", "group");

   const channelRepo = {
        add: jest.fn(),
   }

   const handler = new CreateChannelHandler(channelRepo);

   // act
    await handler.handle(command);

   // assert
    expect(channelRepo.add).toHaveBeenCalled();
});