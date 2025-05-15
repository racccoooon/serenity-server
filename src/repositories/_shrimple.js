export class ShrimpleSql {
    #sql;
    #params;


    /**
     * @private don't use the constructor directly, use the tagged-template `sql` instead
     */
    constructor(sql, params) {
        if (!Array.isArray(sql) || sql.length === 0) {
            throw new Error('not very shrimply of you: pls use sql tagged template')
        }

        const [shrimplifiedSql, shrimplifiedParams] = this.#shrimplify(sql, params);

        this.#sql = shrimplifiedSql;
        this.#params = shrimplifiedParams;
    }

    #shrimplify(terms, params) {
        const shrimpleTerms = [...terms];
        const shrimpleParams = [];

        for (let i = 0; i < params.length; i++) {
            const param = params[i];

            if (param instanceof ShrimpleSql) {
                const before = shrimpleTerms[i];
                const after = shrimpleTerms[i+1];

                let merged;

                if (param.#sql.length === 1) {
                    merged = [before + ' ' + param.#sql[0] + ' ' + after];
                } else if (param.#sql.length > 1) {
                    merged = [before + ' ' + param.#sql[0], ...param.#sql.slice(1, -1), param.#sql[param.#sql.length-1] + ' ' + after];
                } else {
                    throw new Error('shrimple has encountered a problem and will shut down')
                }

                shrimpleTerms.splice(i, 2, ...merged);
                shrimpleParams.push(...param.#params);
            } else {
                shrimpleParams.push(param);
            }
        }

        return [shrimpleTerms, shrimpleParams];
    }

    /**
     * @return {ShrimpleSql}
     */
    clone() {
        return new ShrimpleSql([...this.#sql], [...this.#params])
    }

    /**
     *
     * @param {TemplateStringsArray|ShrimpleSql}term
     * @param {*[]} params
     */
    append(term, ...params) {
        let appendParts;
        if (term instanceof ShrimpleSql) {
            if (params.length > 0) {
                throw new Error(`not very shrimply of you: pls no params with ShrimpleSql`)
            }

            this.#params = [...this.#params, ...term.#params];
            appendParts = term.#sql;
        } else if (Array.isArray(term) && term.length > 0) {
            const [shrimplifiedTerms, shrimplifiedParams] = this.#shrimplify(term, params);

            this.#params = [...this.#params, ...shrimplifiedParams];
            appendParts = shrimplifiedTerms;
        } else {
            throw new Error('not very shrimply of you: please gib ShrimpleSql or use as tag')
        }

        const sql1 = this.#sql.slice(0, -1)
        const last = this.#sql[this.#sql.length - 1];

        const [first, ...sql2] = appendParts;

        this.#sql = [...sql1, last + ' ' + first, ...sql2];
    }

    /**
     * @param {(ShrimpleSql)[]} terms
     * @param {string} separator
     * @param {string|ShrimpleSql} prefix
     */
    appendMany(terms, separator, prefix = null) {
        if (terms.length === 0) return;

        if (prefix !== null) {
            this.append([prefix]);
        }

        let first = true;
        for (const term of terms) {
            if (first) {
                first = false;
            } else {
                this.append([separator]);
            }

            this.append(term);
        }
    }

    toString () {
        const {sql, params} = this.build();

        return `[sql "${sql}" [${params.join(', ')}]]`
    }

    /**
     * @returns {{sql: string, params: *[]}}
     */
    build () {
        let i = 1;
        let sqlStr = '';
        let first = true;

        for (let sqlElement of this.#sql) {
            if (first) {
                first = false;
            } else {
                sqlStr += `$${i}`;
                i += 1;
            }

            sqlStr += sqlElement;
        }

        return {
            sql: sqlStr,
            params: this.#params,
        }
    }
}

/**
 * @param {TemplateStringsArray} template
 * @param {*[]} params
 * @return {ShrimpleSql}
 */
export const sql = (template, ...params) => {
    return new ShrimpleSql(template, params)
};

sql.raw = (str) => {
    return new ShrimpleSql([str], []);
}