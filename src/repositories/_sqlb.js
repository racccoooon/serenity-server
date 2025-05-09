export class Sqlb {
    constructor(sql = null, paramObj = {}) {
        this.query = '';
        this.params = [];
        this.paramCount = 1;  // Start with $1 for the first parameter


        if (!!sql) {
            this.add(sql, paramObj);
        }
    }

    // Add a query part with named parameters
    add(sql, paramObj = {}) {
        this.query += " " + sql;

        // Replace named parameters (e.g. '$userId') with positional placeholders
        for (let [key, value] of Object.entries(paramObj)) {
            const placeholder = `$${key}`;
            if (this.query.includes(placeholder)) {
                this.query = this.query.replace(placeholder, `$${this.paramCount}`);
                this.params.push(value);
                this.paramCount++;
            }
        }

        return this;
    }

    // Build the final SQL query and parameters
    build() {
        return { sql: this.query + ";", params: this.params };
    }
}
