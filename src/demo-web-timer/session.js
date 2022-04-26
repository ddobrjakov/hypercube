import { events } from '@hyper/shared'
import { getAverage, currentAverage, bestAverage, bestTime } from './stats'
import { pretty } from './timer'

export function makeSession() {
    const e = events()
    let solves = [ ]

    function push(solve) {
        solves.push(solve)
        e.raise('push', { session: this, solve })
    }

    function reset() {
        solves = [ ]
        e.raise('reset', { session: this })
    }

    function getTimes() {
        return solves.map(solve => solve.time.formatted)
    }

    function indexedSolves() {
        return solves.map(({ ...solve }, index) => ({ ...solve, index }))
    }

    return {
        on: e.onEvent,
        push, reset,
        get numberOfSolves() { return solves.length },
        get times() { return getTimes() },
        get solves() { return [...solves] },
        get indexedSolves() { return indexedSolves() }
    }
}

export function displaySessionTimes(session, $timesDOM) {
    function timesHTML(session) {
        let resHTML = ""
        for (const indexedSolve of session.indexedSolves) {
            resHTML += `<span class="solve" id="solve-${indexedSolve.index}">${indexedSolve.solve.formatted}</span>`
            if (indexedSolve.index !== session.indexedSolves.length - 1) { resHTML += ", " }
        }
        return resHTML
    }
    $timesDOM.html(timesHTML(session))
}

export function displaySessionStats(session, $statsDOM) {
    function toString(average) {
        return average.dnf ? `DNF` : pretty(average.time)
    }

    function bestAvgToString(bestAvg) {
        return bestAvg.dnf ? `DNF` : toString(bestAvg.average)
    }

    let resHTML = `number of solves: ${session.numberOfSolves}<br>`

    const solves = session.indexedSolves
    
    /* Session average */

    const sessionAvg = getAverage(solves)
    resHTML += `session avg: <span class="stat">${toString(sessionAvg)}</span><br>`

	/* Best solve */

	const best = bestTime(solves)
	resHTML += `best: <span class="stat">${toString(best)}</span><br><br>`

    /* Other averages */

    function showAverage(of) {
        const currAvg = currentAverage(of, solves)
        const bestAvg = bestAverage(of, solves)
        resHTML += `current avg${of}: <span class="stat">${toString(currAvg)}</span><br>`
        resHTML += `best avg${of}: <span class="stat">${bestAvgToString(bestAvg)}</span><br><br>`
    }

    const averages = [5, 12, 25, 50, 100, 250, 500].filter(n => solves.length >= n || n <= 12)
    averages.forEach(showAverage)

    $statsDOM.html(resHTML)
}