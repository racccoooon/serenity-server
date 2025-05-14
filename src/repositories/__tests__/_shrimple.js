import {expect, test} from '@jest/globals'

expect.extend({
    toEqualIgnoreWs(actual, expected) {
        const pass = actual.trim().replace(/\s+/g, ' ') === expected.trim().replace(/\s+/g, ' ')
        const message = () => `expected ${this.utils.printReceived(actual)} to be equal to ${this.utils.printExpected(expected)} ignoring whitespace`
        return {
            message,
            pass,
        }
    },
})

import {sql} from "../_shrimple.js"

test('shrimple', () => {
    const c = sql`shrimple`

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs("shrimple")
    expect(q.params).toStrictEqual([])
})

test('single param', () => {
    const c = sql`shrimple
    ${'sql'}`

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs('shrimple $1')
    expect(q.params).toStrictEqual(['sql'])
})

test('multiple params', () => {
    const c = sql`shrimple
    if x = ${1} and y = ${2}`

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs('shrimple if x = $1 and y = $2')
    expect(q.params).toStrictEqual([1, 2])
})

test('string append', () => {
    const c = sql`shrimple`

    const action = () => c.append('sql')

    // assert
    expect(action).toThrow()
})

test('tagged append', () => {
    const c = sql`shrimple`
    c.append`sql`

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs("shrimple sql")
})

test('tagged append with params', () => {
    const c = sql`shrimple
    if x = ${1}`
    c.append`or y = ${2}`

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs('shrimple if x = $1 or y = $2')
    expect(q.params).toStrictEqual([1, 2])
})

test('shrimple append', () => {
    const c = sql`shrimple`
    c.append(sql`sql`)

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs('shrimple sql')
})

test('shrimple append with params', () => {
    const c = sql`shrimple
    if x = ${1}`
    c.append(sql`or y = ${2}`)

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs('shrimple if x = $1 or y = $2')
    expect(q.params).toStrictEqual([1, 2])
})

test('appendMany strings are not allowed', () => {
    const c = sql`shrimple`


    const action = () => c.appendMany(['a', 'b', 'c'], 'and')

    // assert
    expect(action).toThrow()
})

test('appendMany with prefix', () => {
    const c = sql`shrimple`
    c.appendMany([sql`a`, sql`b`, sql`c`], 'and', 'if')

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs('shrimple if a and b and c')
})

test('appendMany shrimples with params', () => {
    const c = sql`shrimple`
    c.appendMany([sql`a
    = ${1}`, sql`b
    = ${2}`, sql`c
    = ${3}`], 'and', 'if')

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs('shrimple if a = $1 and b = $2 and c = $3')
    expect(q.params).toStrictEqual([1, 2, 3])
})

test('empty appendMany does not append prefix', () => {
    const c = sql`shrimple`
    c.appendMany([], 'and', 'if')

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs('shrimple')
})

test('shrimple param without params gets inserted correctly', () => {
    const c = sql`shrimple`
    c.append`a ${'b'} c ${sql`d`} e ${'f'} g`

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs('shrimple a $1 c d e $2 g')
    expect(q.params).toStrictEqual(['b', 'f'])
})

test('shrimple param with single param gets inserted correctly', () => {
    const c = sql`shrimple`
    c.append`a ${'b'} c ${sql`d ${'e'} f`} g ${'h'} i`

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs('shrimple a $1 c d $2 f g $3 i')
    expect(q.params).toStrictEqual(['b', 'e', 'h'])
})

test('shrimple param with multiple params gets inserted correctly', () => {
    const c = sql`shrimple`
    c.append`a ${'b'} c ${sql`d ${'e'} f ${'g'}`} h ${'i'} j`

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs('shrimple a $1 c d $2 f $3 h $4 j')
    expect(q.params).toStrictEqual(['b', 'e', 'g', 'i'])
})

test('shrimple param in sql tag', () => {
    const b = sql`shrimply good`
    const c = sql`shrimple is ${b}`

    const q = c.build()

    // assert
    expect(q.sql).toEqualIgnoreWs('shrimple is shrimply good')
    expect(q.params).toStrictEqual([])
})