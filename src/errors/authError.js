export class AuthError extends Error{
    constructor() {
        super("Unauthorized");
    }
}