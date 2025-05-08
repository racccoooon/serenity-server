export class NewType {
    #value;

    constructor(value) {
        // Call the subclass-defined validation logic
        this.validate(value);
        this.#value = value;
    }

    validate(_) {
        throw new Error("Subclasses must implement validate()");
    }

    get value() {
        return this.#value;
    }

    toString() {
        return String(this.#value);
    }
}
