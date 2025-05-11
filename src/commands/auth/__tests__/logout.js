import { jest } from '@jest/globals';
import {LogoutCommand, LogoutHandler} from "../logout.js";
import {v4} from "uuid";

test('calls service', async () => {
    // arrange
    const sessionRepo = {
        remove: jest.fn(),
    };

    const command = new LogoutCommand(v4());

    const sut = new LogoutHandler(sessionRepo);

    // act
    await sut.handle(command);

    // assert
    expect(sessionRepo.remove).toHaveBeenCalled();
})