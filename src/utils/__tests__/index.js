import {chunked} from "../index.js";

test('chunked', () => {
     const numbers = [1,2,3,4,5];
     const chunks = chunked(numbers, 2);
     expect(chunks.length).toBe(3);
     expect(chunks[0].length).toBe(2);
     expect(chunks[1].length).toBe(2);
     expect(chunks[2].length).toBe(1);
});