import { jest } from '@jest/globals';
import {LogoutCommand, LogoutHandler} from "../logout.js";
import {SessionId} from "../../../domain/session.js";

test('calls service', async () => {
    // arrange
    const authService = {
        logout: jest.fn(),
    };

    const command = new LogoutCommand(SessionId.gen());

    const sut = new LogoutHandler(authService);

    // act
    await sut.handle(command);

    // assert
    expect(authService.logout).toHaveBeenCalled();
})