import { jest } from '@jest/globals';
import {JoinServerCommand, JoinServerHandler} from "../joinServer.js";
import {v4} from "uuid";
import {AuthError} from "../../../errors/authError.js";
import {HttpError} from "../../../errors/httpError.js";

test('invite not found', async () => {
    // arrange
    const inviteId = v4();
    const command = new JoinServerCommand(v4(), inviteId, v4());

    const inviteRepo = {
        first: jest.fn(() => null),
    };

    const handler = new JoinServerHandler(inviteRepo);

    // act
    expect(async () => await handler.handle(command)).rejects.toThrow(AuthError);

    // assert
    expect(inviteRepo.first).toHaveBeenCalled();
});

test('already joined', async () => {
    // arrange
    const inviteId = v4();
    const command = new JoinServerCommand(v4(), inviteId, v4());

    const inviteRepo = {
        first: jest.fn(() => ({id: inviteId})),
    };

    const membersRepo = {
        first: jest.fn(() => {}),
        add: jest.fn(),
    };

    const handler = new JoinServerHandler(inviteRepo, membersRepo);

    // act
    expect(() => handler.handle(command)).rejects.toThrow(HttpError);

    // assert
    expect(inviteRepo.first).toHaveBeenCalled();
});

test('public invite', async () => {
    // arrange
    const inviteId = v4();
    const command = new JoinServerCommand(v4(), inviteId, v4());

    const inviteRepo = {
        first: jest.fn(() => ({id: inviteId})),
    };

    const membersRepo = {
        first: jest.fn(() => null),
        add: jest.fn(),
    };

    const handler = new JoinServerHandler(inviteRepo, membersRepo);

    // act
    await handler.handle(command);

    // assert
    expect(inviteRepo.first).toHaveBeenCalled();
    expect(membersRepo.first).toHaveBeenCalled();
    expect(membersRepo.add).toHaveBeenCalled();
});