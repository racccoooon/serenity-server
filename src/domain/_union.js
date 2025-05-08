export function Union(...classes) {
    return class {
        #value = undefined;

        constructor(value) {
            let found = false;
            for (const cls of classes) {
                if (value instanceof cls){
                    this.#value = value;
                    return;
                }
            }

            throw new Error("Must be in the provided classes.");
        }

        static from(...values) {
            for (const cls of classes) {
                try {
                    const converted = new cls(...values);
                    return new this(converted);
                } catch {
                    // not found
                }
            }

            throw new Error("Must be be convertable via constructor to one of the provided classes.");
        }

        get value() {
            return this.#value;
        }
        /**
         * @param cls {Class}
         * @returns {cls|null}
         */
        as(cls) {
            if (this.#value instanceof cls){
                return this.#value;
            }
            return null;
        }
    }
}