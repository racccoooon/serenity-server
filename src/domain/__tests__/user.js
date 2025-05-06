import {User} from '../user.js';

test('creates user with username and email', () => {
    const user = new User('testUser', 'test@email.com');

    expect(user.username).toBe('testUser');
    expect(user.email).toBe('test@email.com');
});

test('throws error when username is not a string', () => {
    expect(() => new User(123, 'test@email.com')).toThrow('Username must be a string');
});

test('throws error when email is not a string', () => {
    expect(() => new User('testUser', 123)).toThrow('Email must be a string');
});
