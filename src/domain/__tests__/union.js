import {Union} from '../_union.js'

class Foo {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}
class Bar {}

test('union of foo and bar', () => {
    class U extends Union(Foo, Bar){}
    const foo = new U(new Foo("Bean", 1));
    expect(foo.as(Foo)).toStrictEqual(new Foo("Bean", 1));
    expect(foo.as(Bar)).toEqual(null);
})

test('parse from values', () => {
    class U extends Union(Foo, Bar){}
    const foo = U.from("Bean", 1);
    expect(foo.as(Foo)).toStrictEqual(new Foo("Bean", 1));
    expect(foo.as(Bar)).toEqual(null);
})

test('switch on types', () => {
    class U extends Union(Foo, Bar){}
    const foo = new U(new Foo("Bean", 1));
    switch (true) {
        case foo.value instanceof Foo:
            expect(foo.value).toStrictEqual(new Foo("Bean", 1));
            break;
        case Bar:
            throw new Error("should be a foo");
    }
})