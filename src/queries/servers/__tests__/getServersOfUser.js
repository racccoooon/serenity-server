import {GetServersOfUserHandler, GetServersOfUserQuery} from "../getServersOfUser.js";
import {UserId} from "../../../domain/user.js";
import { jest } from '@jest/globals';

test('no servers found', async () => {
    // arrange
    const serverService = {
        getServersOfUser: jest.fn(() => []),
    };
    const command = new GetServersOfUserQuery(UserId.gen())
    const sut = new GetServersOfUserHandler(serverService);

    // act
    var response = await sut.handle(command);

    // assert
    expect(serverService.getServersOfUser).toHaveBeenCalled();
    expect(response.length).toBe(0);
});

test('servers found', async () => {
    // arrange
    const serverService = {
        getServersOfUser: jest.fn(() => [{name: "srv1"}, {name: "srv2"}]),
    };
    const command = new GetServersOfUserQuery(UserId.gen())
    const sut = new GetServersOfUserHandler(serverService);

    // act
    var response = await sut.handle(command);

    // assert
    expect(serverService.getServersOfUser).toHaveBeenCalled();
    expect(response.length).toBe(2);
});