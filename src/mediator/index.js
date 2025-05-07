// src/mediator/mediator.js
export class Mediator {
  #handlers = new Map()

  register(commandType, handlerFactory) {
    if (!commandType?.prototype) {
      throw new Error('Command type must be a class')
    }

    if (typeof handlerFactory !== 'function') {
      throw new Error('Handler factory must be a function')
    }

    const temp = handlerFactory();
    if(!(temp instanceof Object)) {
      throw new Error('Handler factory must return an object')
    }

    const handleFunc = temp.handle;
    if(typeof handleFunc !== 'function') {
      throw new Error('Handler factory must return a class with a handle function')
    }

    this.#handlers.set(commandType, handlerFactory)
  }

  async send(command) {
    const handlerFactory = this.#handlers.get(command.constructor)
    if (!handlerFactory) {
      throw new Error(`No handler factory registered for ${command.constructor.name}`)
    }

    const handler = handlerFactory();

    return await handler.handle(command)
  }
}