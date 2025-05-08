import {NewType} from "./_newType.js";
import {z} from "zod";

export const sessionTokenSchema = z.string().trim().nonempty();

export class SessionToken extends NewType{
    validate(value) {
        sessionTokenSchema.parse(value)
    }
}