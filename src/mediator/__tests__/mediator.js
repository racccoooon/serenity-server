import {Mediator} from "../index.js";
import { jest } from '@jest/globals';

class TestCommand {}
class UnregisteredCommand {}

test('command handler must be a function', async () => {
  const mediator = new Mediator().service({})
  
  expect(() => {
    mediator.register(TestCommand, 'not a function')
  }).toThrow('Handler factory must be a function')
})

test('registering string as command type throws error', () => {
  const mediator = new Mediator().service({})

  expect(() => {
    mediator.register('StringCommand', () => {})
  }).toThrow('Command type must be a class')
})

test('sending unregistered command throws error', async () => {
  const mediator = new Mediator().service({})
  const command = new UnregisteredCommand()

  await expect(
      mediator.send(command)
  ).rejects.toThrow('No handler factory registered for UnregisteredCommand')
})

test('successfully handles command', async () => {
  const mediator = new Mediator().service({})
  const expectedResult = { success: true }
  const handleFunc = jest.fn().mockResolvedValue(expectedResult)
  const factory = () => ({ handle: handleFunc })
  const command = new TestCommand()

  mediator.register(TestCommand, factory)
  const result = await mediator.send(command)

  expect(result).toEqual(expectedResult)
  expect(handleFunc).toHaveBeenCalledWith(command)
})
