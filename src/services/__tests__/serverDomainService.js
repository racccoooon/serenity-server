import {createServerModel, ServerDomainService} from "../serverDomainService.js";
import {Server} from "../../domain/server.js";
import { jest } from '@jest/globals';
import {UserId} from "../../domain/user.js";

test('create ', async () => {
    // arrange
    const server = new Server(UserId.gen(), "Bean Server", "Beanly server.");

    const serverRepository  = {
        add: jest.fn(),
    };

    const sut = new ServerDomainService({serverRepository});

    // act
    await sut.createServer(server);

    // assert
    expect(serverRepository.add).toHaveBeenCalledWith(createServerModel(server));
});