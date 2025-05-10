// src/mediator/mediator.js
export class Mediator {
  #handlers = new Map();
  /**
   * @type {import('../container').Scope}
   */
  #scope = null;

  service(scope) {
    this.scope = scope;
    const result = new Mediator();
    result.#scope = scope;
    result.#handlers = this.#handlers;
    return result;
  }

  register(commandType, handlerFactory) {
    if (!commandType?.prototype) {
      throw new Error('Command type must be a class')
    }

    if (typeof handlerFactory !== 'function') {
      throw new Error('Handler factory must be a function')
    }

    this.#handlers.set(commandType, handlerFactory)
  }

  async send(command) {
    if (!this.#scope) {
      throw new Error("Service provider is not set. Did you forget to call `.service(scope)`?")
    }

    const handlerFactory = this.#handlers.get(command.constructor)
    if (!handlerFactory) {
      throw new Error(`No handler factory registered for ${command.constructor.name}`)
    }

    const handler = handlerFactory(this.#scope);

    return await handler.handle(command)
  }
}