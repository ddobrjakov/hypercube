export const extractSubarray = (array, indices) => 
    indices.map(index => array[index])

const rotateIndices = (array, indices, rotate) => {
    const rotatedSubarray = rotate(extractSubarray(array, indices))
    indices.forEach((index, i) => array[index] = rotatedSubarray[i])
}

export const rotateArrayCW = array => {
    const shifted = [...array]
    shifted.unshift(shifted.pop())
    return shifted
}

export const rotateArrayCCW = ([first, ...rest]) => [...rest, first]
export const rotateIndicesCW = (array, indices) => rotateIndices(array, indices, rotateArrayCW)
export const rotateIndicesCCW = (array, indices) => rotateIndices(array, indices, rotateArrayCCW)

export const delayedForeach = async (seq, delay, action) => {
    for (let elem of seq) { 
        await new Promise(r => setTimeout(r, delay))
        action(elem)
    }
}

export const isString = obj => (obj instanceof String || typeof(obj) === 'string')

export const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]))

export const range = (from, to) =>
    [...Array(to - from + 1).keys()].map(elem => elem + from)
