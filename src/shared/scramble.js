function subtract(arr1, arr2) { return arr1.filter(elem => !arr2.includes(elem)) }
function range(from, to) { return [...Array(to - from + 1).keys()].map(elem => elem + from) }
function random(arr) { return arr[~~(Math.random() * arr.length)] }
function isNotUndefined(val) { return val !== undefined }

function randomMoves(length) {

    const moves = [ 'U', 'F', 'R', 'L', 'B', 'D' ]
    const modifiers = [ "", "2", "'" ]

    function appendMove([b, a, ]) {
        const forbiddenIndices = ((a + b !== 5) ? [b] : [a, b]).filter(isNotUndefined)
        return [random(subtract(range(0, 5), forbiddenIndices)), ...arguments[0]]
    }

    function appendMoves(length, acc) {
        if (length === 0) { return acc }
        return appendMoves(length - 1, appendMove(acc))
    }

    return appendMoves(length, []).map(index => moves[index] + random(modifiers))
}

export function randomScramble(length) { return randomMoves(length).join(' ') }
