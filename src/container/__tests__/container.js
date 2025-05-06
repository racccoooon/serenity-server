import {Container} from "../index.js";
import { jest } from '@jest/globals';

test('registering non-class interface throws error', () => {
    const container = new Container()

    expect(() => {
        container.register('notAClass', () => {})
    }).toThrow('Interface must be a class')
})
