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
