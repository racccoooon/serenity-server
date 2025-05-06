import {Mediator} from "../index.js";

test('command handler must be a function', async () => {
  const mediator = new Mediator()
  
  expect(() => {
    mediator.register('TestCommand', 'not a function')
  }).toThrow('Handler must be a function')
})