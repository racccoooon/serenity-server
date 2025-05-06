// src/container/container.js
export class Container {
  #services = new Map()

  register(interfaceType, implementation) {
    if (!interfaceType?.prototype) {
      throw new Error('Interface must be a class')
    }
    this.#services.set(interfaceType, implementation)
  }

  resolve(interfaceType) {
    return this.#services.get(interfaceType)
  }
}