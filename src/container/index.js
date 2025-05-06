// src/container/container.js
export class Container {
  #serviceProviders = new Map()

  registerSingleton(interfaceType, implementation) {
    if (!interfaceType?.prototype) {
      throw new Error('Interface must be a class')
    }
    if (typeof implementation === 'function') {
      throw new Error('Implementation must not be a function')
    }
    this.#serviceProviders.set(interfaceType, implementation)
  }

  registerTransient(interfaceType, implementation) {
    if (!interfaceType?.prototype) {
      throw new Error('Interface must be a class')
    }
    if (typeof implementation !== 'function') {
      throw new Error('Implementation must be a function')
    }
    this.#serviceProviders.set(interfaceType, implementation)
  }

  resolve(interfaceType) {
    const serviceProvider = this.#serviceProviders.get(interfaceType);

    if(typeof serviceProvider === 'function') {
      return serviceProvider();
    }

    return serviceProvider;
  }
}