// src/mediator/mediator.js
export class Mediator {
  #handlers = new Map()

  register(commandType, handler) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function')
    }
    this.#handlers.set(commandType, handler)
  }
}