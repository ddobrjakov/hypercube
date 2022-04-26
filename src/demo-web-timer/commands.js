import { timerDisplay } from './timer'
import { events } from '@hyper/shared'
import { CubeState } from '@hyper/hypercube'
import { makeSession, displaySessionTimes, displaySessionStats } from './session'

/** Returns if it was called for the first time. */
function firstTime() {
	let isFirst = true
	return (function() {
		const tmp = isFirst
		isFirst = false
		return tmp
	})
}

/** Are the moves just a rotation. */
function isRotation(moves) {
	return new CubeState().makeMoves(moves).isSolved()
}

/** Takes 'make a move' and 'scramble the cube' requests, and acts depending on situation. */
export function moveRequests(hypercube) {

	/* Status */
	let inspection = false // cube is scrambled && timer is reset
	let freemode = true // cube is solved / scrambled by hand && not scrambled by request
	let isScrambling = false
	let isMoving = false
	let midSolve = false

	/* Timer display */
	const tdisplay = timerDisplay($('#time_p'))
	
	/* Session */
	const session = makeSession()
	function displaySession(e) {
		displaySessionTimes(e.session, $('#times'))
		displaySessionStats(e.session, $('#stats'))
	}
	displaySession({ session })
	session.on('reset', displaySession)
	session.on('push', displaySession)

	/* Receiving requests */

	function scrambleRequest(moves, options) {
		if (isScrambling) { 
			console.log("Scrambling while scrambling is not allowed (sorry).")
			return
		}
		if (inspection) {
			console.log("Scrambling while inspecting is not allowed.")
			return
		}
		events.requestScramble(moves, options)
	}

	function movesRequest(moves, options) {
		if (isScrambling) {
			console.log("Moving while scrambling is not allowed.")
			return
		}
		events.requestMoves(moves, options)
	}

	function moveRequest(move, options) {
		if (isScrambling) {
			console.log("Moving while scrambling is not allowed.")
			return
		}
		events.requestMove(move, options)
	}

	/* Receiving events */

	const events = moveEvents(hypercube)
	events.on('moveStart', onMoveStart)
	events.on('moveEnd', onMoveEnd)
	events.on('scrambleStart', onScrambleStart)
	events.on('scrambleEnd', onScrambleEnd)

	/** onMoveStart handler. Catches both scramble moves and user moves. */
	function onMoveStart(data) {

		isMoving = true

		if (data.type === 'scramble') return

		if (isRotation(data.move)) return

		// Start the solve, if at inspection stage
		if (inspection) {
			inspection = false
			midSolve = true
			tdisplay.start()
			return
		}

	}

	/** onMoveEnd handler. Catches both scramble moves and user moves. */
	function onMoveEnd(data) {
		
		isMoving = false

		// Check if the cube is now solved
		const state = hypercube.cube.getState()
		const isSolvedBefore = state.copy().undoMove(data.move).isSolved()
		const isSolvedAfter = state.isSolved()

		// Ignore if this is any move in freemode
		if (freemode) return

		// Ignore if this move is a part of the scramble
		if (data.type === 'scramble') return
		
		// Cube solved (legitimately, i.e. solve is finished)
		if (!isSolvedBefore && isSolvedAfter) {
			midSolve = false
			freemode = true
			tdisplay.stop()
			session.push({ solve: tdisplay.time })
		}

	}

	function onScrambleStart(moves) {
		// DNF current solve if scramble started in the middle of the solve
		if (midSolve) {
			tdisplay.stop()
			tdisplay.setPenalty('DNF')
			midSolve = false
			session.push({ solve: tdisplay.time })
		}
		isScrambling = true
		freemode = false
	} 

	function onScrambleEnd(data) {
		// Finish scramble and start inspection
		isScrambling = false
		inspection = true
	}

	return {
		scrambleRequest, movesRequest, moveRequest
	}

}

/** Helps distinguish between scramble moves and user moves. */
function moveEvents(hypercube) {
	
	const e = events()
	
	function requestMove(move, options) {
		hypercube.cube.animateMove({   
			move, options,
			onMoveStart: data => e.raise('moveStart', { move: data.move, type: 'user' }),
			onMoveEnd: data => e.raise('moveEnd', { move: data.move, type: 'user' })
		})
	}

	function requestMoves(moves, options) {
		hypercube.cube.animateMoves({
			moves, options,
			onMoveStart: data => e.raise('moveStart', { move: data.move, type: 'user' }),
			onMoveEnd: data => e.raise('moveEnd', { move: data.move, type: 'user' }),
		})
	}

	function requestScramble(moves, options) { 
		const ft = firstTime()
		hypercube.cube.animateMoves({
			moves, options,
			onMoveStart: data => {
				if (ft()) e.raise('scrambleStart', { moves: moves })
				e.raise('moveStart', { move: data.move, type: 'scramble' })
			},
			onMoveEnd: data => e.raise('moveEnd', { move: data.move, type: 'scramble' }),
			onAnimationEnd: data => e.raise('scrambleEnd', { moves: data.moves }),
		})
	}

	return {
		on: e.onEvent,
		requestMove,
		requestMoves,
		requestScramble
	}

}
