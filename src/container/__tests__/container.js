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
        container.register('notAClass', () => {})
    }).toThrow('Interface must be a class')
})

test('can register and resolve implementation', () => {
    const container = new Container()
    const implementation = new TestImplementation()

    container.register(TestInterface, implementation)
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