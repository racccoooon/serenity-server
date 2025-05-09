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

  /**
   @template T
   * @param {T} interfaceType
   * @returns {T}
   */
  resolve(interfaceType) {
    const serviceProvider = this.#serviceProviders.get(interfaceType);

    if(!serviceProvider) {
      throw new Error(`No registration found for ${interfaceType.name}`)
    }

    if(typeof serviceProvider === 'function') {
      return serviceProvider(this);
    }

    return serviceProvider;
  }
}