import {Mediator, MediatorBuilder} from "../index.js";
import { jest } from '@jest/globals';

class TestCommand {}
class UnregisteredCommand {}

test('command handler must be a function', async () => {
  const builder = new MediatorBuilder();

  expect(() => {
    builder.register(TestCommand, 'not a function')
  }).toThrow('Handler factory must be a function')
})

test('registering string as command type throws error', () => {
  const builder = new MediatorBuilder();

  expect(() => {
    builder.register('StringCommand', () => {})
  }).toThrow('Command type must be a class')
})

test('sending unregistered command throws error', async () => {
  const builder = new MediatorBuilder();
  const command = new UnregisteredCommand()
  const mediator = builder.build({});

  await expect(
      mediator.send(command)
  ).rejects.toThrow('No handler factory registered for UnregisteredCommand')
})

test('successfully handles command', async () => {
  const builder = new MediatorBuilder();
  const expectedResult = { success: true }
  const handleFunc = jest.fn().mockResolvedValue(expectedResult)
  const factory = () => ({ handle: handleFunc })
  const command = new TestCommand()

  builder.register(TestCommand, factory)
  const mediator = builder.build({});

  const result = await mediator.send(command)

  expect(result).toEqual(expectedResult)
  expect(handleFunc).toHaveBeenCalledWith(command)
})
