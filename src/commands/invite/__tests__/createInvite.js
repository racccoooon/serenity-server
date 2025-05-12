import { jest } from '@jest/globals';
import {CreateInviteCommand, CreateInviteHandler} from "../createInvite.js";
import {v4} from "uuid";

test('foo', async () => {
    // arrange
    const inviteRepo = {
        add: jest.fn(),
    };

    const command = new CreateInviteCommand(
        v4(),
        null,
    );

    const handler = new CreateInviteHandler(inviteRepo);

    // act
    await handler.handle(command);

    // assert
    expect(inviteRepo.add).toHaveBeenCalled();
});