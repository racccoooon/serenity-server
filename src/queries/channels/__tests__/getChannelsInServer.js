import {GetChannelsInServerHandler, GetChannelsInServerQuery} from "../getChannelsInServer.js";
import { jest } from '@jest/globals';
import {v4} from "uuid";

test('get channels', async () => {
    // arrange
    const query = new GetChannelsInServerQuery(v4());

    const channelRepo = {
        list: jest.fn(),
    };

    const handler = new GetChannelsInServerHandler(channelRepo);

    // act
    await handler.handle(query);

    // assert
    expect(channelRepo.list).toHaveBeenCalled();
});