import { randomScramble } from '../shared'

export function cubeCommands(hypercube) {
	let currentScramble
	return { 
		scramble: function() { 
			hypercube.cube.reset()
			currentScramble = randomScramble(25)
			requestScramble(hypercube, currentScramble)
		},
		takeBack: function() {
			if (!currentScramble) return
			hypercube.cube.reset()
			requestScramble(hypercube, currentScramble)
		},
		showScramble: () => { 
			if (currentScramble != undefined) alert(`Scramble: ${currentScramble}`)
			else alert(`No scramble`)
		},
		solve: () => hypercube.cube.reset()
	}
}

function requestScramble(hypercube, moves) {
	hypercube.cube.animateMoves({ moves, options: { tps: Infinity } })
}
