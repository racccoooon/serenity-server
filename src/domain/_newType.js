export class NewType {
    constructor(value) {
        // Call the subclass-defined validation logic
        this.validate(value);
        this._value = value;
    }

    validate(_) {
        throw new Error("Subclasses must implement validate()");
    }

    get value() {
        return this._value;
    }

    toString() {
        return String(this._value);
    }
}
