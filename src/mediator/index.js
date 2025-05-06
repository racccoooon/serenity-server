// src/mediator/mediator.js
export class Mediator {
  #handlers = new Map()

  register(commandType, handler) {
    if (!commandType?.prototype) {
      throw new Error('Command type must be a class')
    }

    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function')
    }

    this.#handlers.set(commandType, handler)
  }

  async send(command) {
    const handler = this.#handlers.get(command.constructor)
    if (!handler) {
      throw new Error(`No handler registered for ${command.constructor.name}`)
    }
  }

}