export class NewType {
    constructor(value) {
        this._value = value;

        // Call the subclass-defined validation logic
        this.validate(value);

        // Return a Proxy to expose the underlying primitive's properties/methods
        return new Proxy(this, {
            get: (target, prop) => {
                if (prop in target) return target[prop];
                if (prop in target._value) {
                    const val = target._value[prop];
                    return typeof val === 'function' ? val.bind(target._value) : val;
                }
            },
            set: () => {
                throw new Error(`${this.constructor.name} is immutable.`);
            }
        });
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

    valueOf() {
        return this._value;
    }

    equals(other) {
        return other instanceof this.constructor && this.value === other.value;
    }
}
