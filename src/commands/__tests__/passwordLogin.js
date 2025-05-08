import {PasswordLoginHandler} from "../auth/passwordLogin.js";

test('Login user without command', async () => {
    const handler = new PasswordLoginHandler();
    expect(handler.handle()).rejects.toThrow('Command must be provided');
})
