import {GetServersOfUserHandler, GetServersOfUserQuery} from "../getServersOfUser.js";
import {UserId} from "../../../domain/user.js";
import { jest } from '@jest/globals';

test('no servers found', async () => {
    // arrange
    const serverRepo = {
        list: jest.fn(() => []),
    };
    const command = new GetServersOfUserQuery(UserId.gen())
    const sut = new GetServersOfUserHandler(serverRepo);

    // act
    var response = await sut.handle(command);

    // assert
    expect(serverRepo.list).toHaveBeenCalled();
    expect(response.length).toBe(0);
});

test('servers found', async () => {
    // arrange
    const serverRepo = {
        list: jest.fn(() => [{}]),
    };
    const query = new GetServersOfUserQuery(UserId.gen())
    const sut = new GetServersOfUserHandler(serverRepo);

    // act
    var response = await sut.handle(query);

    // assert
    expect(serverRepo.list).toHaveBeenCalled();
    expect(response.length).toBe(1);
});