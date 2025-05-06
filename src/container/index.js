// src/container/container.js
export class Container {
  register(interfaceType, implementation) {
    if (!interfaceType?.prototype) {
      throw new Error('Interface must be a class')
    }
  }
}