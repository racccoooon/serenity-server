import {User, UserName} from '../user.js';

test('creates user with username and email', () => {
    const user = new User(new UserName('testUser'), 'test@email.com');

    expect(user.username.value).toBe('testUser');
    expect(user.email).toBe('test@email.com');
});

test('throws error when username is not a string', () => {
    expect(() => new User(123, 'test@email.com')).toThrow('Username must be a UserName');
});

test('throws error when email is not a string', () => {
    expect(() => new User(new UserName('testUser'), 123)).toThrow('Email must be a string');
});
