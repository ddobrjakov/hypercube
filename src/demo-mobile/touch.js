import { createTrigger } from '../shared'
import { cubeCommands } from './commands'

export function connectTouch(hypercube, grid) {
	const commands = cubeCommands(hypercube)
	const pathCode = path => { 
		if (path.from === undefined) return undefined
		const convert = point => `${point[1] * 3 + point[0] + 1}`
		if (path.to === undefined) return convert(path.from)
		return convert(path.from) + convert(path.to)
	}
	const touch = createTrigger(trigger => grid.subscribe('enter', path => trigger(pathCode(path))))
	touch.use(touchMovesMap(), ({ move }) => hypercube.cube.animateMove({ move }))
	touch.use(touchCommandsMap(commands), command => command())
}

const touchMovesMap = () => ({
	"32": { move: "U" },	"21": { move: "U" },
	"12": { move: "U'" },	"23": { move: "U'" },
	"31": { move: "U2" },	
	"13": { move: "U2'" },
	"63": { move: "R" },
	"36": { move: "R'" },
	"93": { move: "R2" }, 	
	"39": { move: "R2'" },
	"69": { move: "F" },	"74": { move: "F" },
	"47": { move: "F'" },	"96": { move: "F'"},
	"67": { move: "F2" }, 	
	"76": { move: "F2'" },
	"54": { move: "y" },	"65": { move: "y" },
	"56": { move: "y'" },	"45": { move: "y'" },
	"64": { move: "y2" }, 	
	"46": { move: "y2'" },
	"52": { move: "x" },	"85": { move: "x" },
	"25": { move: "x'" }, 	"58": { move: "x'" },
	"82": { move: "x2" }, 	
	"28": { move: "x2'" },
	"78": { move: "D" },	"89": { move: "D" },
	"87": { move: "D'" }, 	"98": { move: "D'" },
	"79": { move: "D2" }, 	
	"97": { move: "D2'" },
	"14": { move: "L" },
	"41": { move: "L'" },
	"17": { move: "L2" }, 	
	"71": { move: "L2'" },
	"24": { move: "B" },	"62": { move: "B" },
	"26": { move: "B'" },	"42": { move: "B'" },
	"29": { move: "B2" }, 	"72": { move: "B2" },
	"92": { move: "B2'" },	"27": { move: "B2'" },
	"73": { move: "z" },	"19": { move: "z" },
	"37": { move: "z'" },	"91": { move: "z'" },
	"86": { move: "M'" },	"84": { move: "M'" },
	"68": { move: "M" },	"48": { move: "M" },
	"38": { move: "M2" },	"18": { move: "M2" },
	"83": { move: "M2'" },	"81": { move: "M2'" },
	"94": { move: "f'" },
	"49": { move: "f" },
	"16": { move: "S" },
	"61": { move: "S'" },
	"43": { move: "E" },
	"34": { move: "E'" },
	"95": { move: "r" },
	"59": { move: "r'" },
	"57": { move: "l" },
	"75": { move: "l'" },
	"15": { move: "u'" }, 	"53": { move: "u'" },
	"35": { move: "u" }, 	"51": { move: "u" },
})

/*
	remove: B2, F2
	62: r, 26: r'
	35: u, 53: u'
	51: u, 15: u'
	24: l, 42: l'
	92: B, 29: B'
	27: B, 72: B'
*/

const touchCommandsMap = (commands) => ({
	"5": commands.solve,
	"9": commands.scramble,
	"7": commands.takeBack,
	"1": commands.showScramble
})
