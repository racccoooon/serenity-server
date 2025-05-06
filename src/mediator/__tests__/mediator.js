import {Mediator} from "../index.js";

class TestCommand {}

test('command handler must be a function', async () => {
  const mediator = new Mediator()
  
  expect(() => {
    mediator.register(TestCommand, 'not a function')
  }).toThrow('Handler must be a function')
})

test('registering string as command type throws error', () => {
  const mediator = new Mediator()

  expect(() => {
    mediator.register('StringCommand', () => {})
  }).toThrow('Command type must be a class')
})
