import {GetServersOfUserHandler, GetServersOfUserQuery} from "../getServersOfUser.js";
import { jest } from '@jest/globals';
import {v4} from "uuid";

test('no servers found', async () => {
    // arrange
    const serverRepo = {
        list: jest.fn(() => []),
    };
    const command = new GetServersOfUserQuery(v4())
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
    const query = new GetServersOfUserQuery(v4())
    const sut = new GetServersOfUserHandler(serverRepo);

    // act
    var response = await sut.handle(query);

    // assert
    expect(serverRepo.list).toHaveBeenCalled();
    expect(response.length).toBe(1);
});