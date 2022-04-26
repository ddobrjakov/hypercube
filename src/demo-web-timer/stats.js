import { orderBy, slice, take, takeRight, meanBy } from 'lodash'

function actualTime(solve) {
    if (solve.penalty === 'DNF') { return Infinity }
    if (solve.penalty === '+2') { return solve.time + 2 }
    return solve.time
}

function sortedSolves(indexedSolves) {
    function comparisonValue(indexedSolve) {
        if (indexedSolve.solve.penalty === 'DNF') { return Infinity }
        if (indexedSolve.solve.penalty === '+2') { return indexedSolve.solve.time + 2 }
        return indexedSolve.solve.time
    }
    return orderBy(indexedSolves, comparisonValue)
}

export function bestTime(indexedSolves) {
	if (indexedSolves.length === 0) return { dnf: true, reason: 'count' }
	const best = sortedSolves(indexedSolves)[0]
	return { dnf: best.solve.penalty === 'DNF', time: actualTime(best.solve) }
}

export function getAverage(indexedSolves) {
    const count = indexedSolves.length
    if (count < 3) { return { dnf: true, reason: "count" } }
    const sorted = sortedSolves(indexedSolves)
    const dropCount = ~~((count - 1) / 20) + 1
    if (sorted[sorted.length - 1 - dropCount].solve.penalty === 'DNF') { return { dnf: true, reason: "dnfs" }}
    const sliced = slice(sorted, dropCount, count - 2 * dropCount + 1) 
    return { dnf: false, time: meanBy(sliced, is => actualTime(is.solve)) }
}

export function currentAverage(of, indexedSolves) {
    if (of > indexedSolves.length) return { dnf: true, reason: "count" }
    const involvedSolves = takeRight(indexedSolves, of)
    return getAverage(involvedSolves)
}

export function bestAverage(of, indexedSolves) {

    function isBetterAverage(avg1, avg2) {
        if (avg1.dnf) return false
        if (avg2.dnf) return true
        return avg1.time < avg2.time
    }

    if (of > indexedSolves.length) return { dnf: true, reason: "count" }
    let bestIndex = 0
    let bestAverage = getAverage(take(indexedSolves, of))
    for (let i = 0; i < indexedSolves.length - of + 1; i++) {
        const solves = slice(indexedSolves, i, i + of)
        const average = getAverage(solves)
        if (isBetterAverage(average, bestAverage)) {
            bestAverage = average
            bestIndex = solves[0].index
        }
    }
    return { average: bestAverage, index: bestIndex }

}