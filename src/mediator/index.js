export class MediatorBuilder {
  #handlers = new Map();

  register(commandType, handlerFactory) {
    if (!commandType?.prototype) {
      throw new Error('Command type must be a class')
    }

    if (typeof handlerFactory !== 'function') {
      throw new Error('Handler factory must be a function')
    }

    this.#handlers.set(commandType, handlerFactory)
  }

  build(serviceProvider) {
    return new Mediator(this.#handlers, serviceProvider);
  }
}


export class Mediator {
  #handlers = new Map();
  #serviceProvider = null;

  constructor(handlers, serviceProvider) {
    this.#handlers = handlers;
    this.#serviceProvider = serviceProvider;
  }

  async send(command) {
    const handlerFactory = this.#handlers.get(command.constructor)
    if (!handlerFactory) {
      throw new Error(`No handler factory registered for ${command.constructor.name}`)
    }

    const handler = handlerFactory(this.#serviceProvider);

    return await handler.handle(command)
  }
}