export function isLastIndex(i, array){
    return i + 1 === array.length;
}

export function chunked(array, size = 100) {
    const chunkCount = Math.ceil(array.length / size);
    const chunks = new Array(chunkCount);

    for (let i = 0; i < chunkCount; i++) {
        const lower = i * size;
        const upper = Math.min((i+1) * size, array.length);

        chunks[i] = array.slice(lower, upper);
    }

    return chunks;
}