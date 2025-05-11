import {createServerModel, ServerDomainService} from "../serverDomainService.js";
import {Server} from "../../domain/server.js";
import {jest} from '@jest/globals';
import {UserId} from "../../domain/user.js";

test('create ', async () => {
    // arrange
    const server = new Server(UserId.gen(), "Bean Server", "Beanly server.");

    const serverRepository = {
        add: jest.fn(),
    };

    const sut = new ServerDomainService({serverRepository});

    // act
    await sut.createServer(server);

    // assert
    expect(serverRepository.add).toHaveBeenCalledWith(createServerModel(server));
});

test('getting services of user', async () => {
    // arrange
    const serverRepository = {
        whereUserId: jest.fn(() => serverRepository),
        toPaged: jest.fn(() => ({
            data: [{name: "srv1"}, {name: "srv2"}],
            totalCount: 2
        })),
    };

    const sut = new ServerDomainService({serverRepository});

    // act
    const servers = await sut.getServersOfUser(UserId.gen());

    // assert
    expect(serverRepository.whereUserId).toHaveBeenCalled();
    expect(serverRepository.toPaged).toHaveBeenCalled();
    expect(servers.data.length).toBe(2);
});