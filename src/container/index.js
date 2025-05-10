export class Container {
  #serviceProviders = new Map();

  registerSingleton(interfaceType, implementation) {
    this.#assertValidInterface(interfaceType);

    if (typeof implementation === 'function') {
      throw new Error('Implementation must not be a function');
    }

    this.#serviceProviders.set(interfaceType, {
      type: 'singleton',
      value: implementation
    });
  }

  registerTransient(interfaceType, factory) {
    this.#assertValidInterface(interfaceType);

    if (typeof factory !== 'function') {
      throw new Error('Implementation must be a function');
    }

    this.#serviceProviders.set(interfaceType, {
      type: 'transient',
      value: factory
    });
  }

  registerScoped(interfaceType, factory) {
    this.#assertValidInterface(interfaceType);

    if (typeof factory !== 'function') {
      throw new Error('Implementation must be a function');
    }

    this.#serviceProviders.set(interfaceType, {
      type: 'scoped',
      value: factory
    });
  }

  /**
   @template T
   * @param {T} interfaceType
   * @returns {T}
   */
  resolve(interfaceType) {
    const entry = this.#serviceProviders.get(interfaceType);

    if (!entry) {
      throw new Error(`No registration found for ${interfaceType.name}`);
    }

    switch (entry.type) {
      case 'singleton':
        return entry.value;
      case 'transient':
        return entry.value(this);
      case 'scoped':
        throw new Error('Scoped services must be resolved from a scope');
      default:
        throw new Error(`Unknown service type: ${entry.type}`);
    }
  }

  createScope() {
    return new Scope(this);
  }

  #assertValidInterface(interfaceType) {
    if (!interfaceType?.prototype) {
      throw new Error('Interface must be a class');
    }
  }

  // Expose for use in Scope only
  _getServiceProvider(interfaceType) {
    return this.#serviceProviders.get(interfaceType);
  }
}

export class Scope {
  #container;
  #scopedInstances = new Map();

  constructor(container) {
    this.#container = container;
  }

  resolve(interfaceType) {
    const entry = this.#container._getServiceProvider(interfaceType);

    if (!entry) {
      throw new Error(`No registration found for ${interfaceType.name}`);
    }

    switch (entry.type) {
      case 'singleton':
        return entry.value;

      case 'transient':
        return entry.value(this); // pass scope, just like container would

      case 'scoped':
        if (!this.#scopedInstances.has(interfaceType)) {
          const instance = entry.value(this); // scope-level instance
          this.#scopedInstances.set(interfaceType, instance);
        }
        return this.#scopedInstances.get(interfaceType);

      default:
        throw new Error(`Unknown service type: ${entry.type}`);
    }
  }

  async dispose() {
    for (const service of this.#scopedInstances.values()) {
      if (typeof service.dispose === 'function') {
        await service.dispose(); // supports async dispose methods
      }
    }

    this.#scopedInstances.clear();
  }
}
