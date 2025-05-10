import {Container} from "../index.js";
import { jest } from '@jest/globals';

class TestInterface {
    doSomething() {}
}

class TestImplementation {
    doSomething() {}
}


test('registering non-class interface throws error', () => {
    const container = new Container()

    expect(() => {
        container.registerSingleton('notAClass', () => {})
    }).toThrow('Interface must be a class')
})

test('can register and resolve implementation', () => {
    const container = new Container()
    const implementation = new TestImplementation()

    container.registerSingleton(TestInterface, implementation)
    const resolved = container.resolve(TestInterface)

    expect(resolved).toBe(implementation)
})

test('can register and resolve transient implementation', () => {
    const container = new Container()

    container.registerTransient(TestInterface, () => new TestImplementation())
    const resolved = container.resolve(TestInterface)

    expect(resolved).toBeInstanceOf(TestImplementation)
})

test('transient has to be a function', () => {
    const container = new Container()

    expect(() => {
        container.registerTransient(TestInterface, new TestImplementation())
    }).toThrow('Implementation must be a function')
})

test('transient service is a new instance each time', () => {
    const container = new Container()

    container.registerTransient(TestInterface, () => new TestImplementation())
    const resolved1 = container.resolve(TestInterface)
    const resolved2 = container.resolve(TestInterface)

    expect(resolved1).not.toBe(resolved2)
})

test('singleton service is the same instance each time', () => {
    const container = new Container()

    container.registerSingleton(TestInterface, new TestImplementation())
    const resolved1 = container.resolve(TestInterface)
    const resolved2 = container.resolve(TestInterface)

    expect(resolved1).toBe(resolved2)
})

test('singleton must not be a function', () => {
    const container = new Container()

    expect(() => {
        container.registerSingleton(TestInterface, () => new TestImplementation())
    }).toThrow('Implementation must not be a function')
})

class ServiceWithDependency {
    constructor(dependency) {
        this.dependency = dependency
    }
}

test('resolves passes container into function', () => {
    const container = new Container()
    const dependency = new TestImplementation()

    container.registerSingleton(TestInterface, dependency)

    container.registerTransient(ServiceWithDependency, (c) => {
        const dependency = c.resolve(TestInterface)
        return new ServiceWithDependency(dependency)
    })

    const resolved = container.resolve(ServiceWithDependency)
    expect(resolved.dependency).toBe(dependency)
})

test('throws when resolving unregistered service', () => {
    const container = new Container()

    expect(() => {
        container.resolve(TestInterface)
    }).toThrow('No registration found for TestInterface')
})

test('resolving scoped service from root container throws', () => {
    const container = new Container()

    container.registerScoped(TestInterface, (c) => new TestImplementation())

    expect(() => {
        container.resolve(TestInterface)
    }).toThrow('Scoped services must be resolved from a scope')
})


test('scoped service returns same instance within scope, different across scopes', () => {
    const container = new Container();

    class ScopedService {}

    container.registerScoped(ScopedService, () => new ScopedService());

    const scope1 = container.createScope();
    const scope2 = container.createScope();

    const instance1a = scope1.resolve(ScopedService);
    const instance1b = scope1.resolve(ScopedService);
    const instance2 = scope2.resolve(ScopedService);

    expect(instance1a).toBe(instance1b);      // Same within scope
    expect(instance1a).not.toBe(instance2);   // Different across scopes
});

test('singleton services resolved in scope return the same instance as in root', () => {
    const container = new Container()
    const singletonInstance = new TestImplementation()

    container.registerSingleton(TestInterface, singletonInstance)

    const scope = container.createScope()
    const resolvedFromScope = scope.resolve(TestInterface)
    const resolvedFromRoot = container.resolve(TestInterface)

    expect(resolvedFromScope).toBe(singletonInstance)
    expect(resolvedFromRoot).toBe(singletonInstance)
})

test('transient services return a new instance each time across scopes and container', () => {
    const container = new Container()

    container.registerTransient(TestInterface, () => new TestImplementation())

    const fromContainer1 = container.resolve(TestInterface)
    const fromContainer2 = container.resolve(TestInterface)

    const scope = container.createScope()
    const fromScope1 = scope.resolve(TestInterface)
    const fromScope2 = scope.resolve(TestInterface)

    expect(fromContainer1).not.toBe(fromContainer2)
    expect(fromScope1).not.toBe(fromScope2)
    expect(fromContainer1).not.toBe(fromScope1)
    expect(fromContainer2).not.toBe(fromScope2)
})

