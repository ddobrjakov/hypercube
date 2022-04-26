import { movesKeyMap, createTrigger } from '../shared'

export function connectKeyboard(hypercube, dom) {
	const keyboard = createTrigger(trigger => {
		$(dom).on('keydown', e => {
			if (!trigger(e.key).success)
				console.log(`No binding for key '${e.key}'`)
		})
	})
	keyboard.use(movesKeyMap(), ({ move }) => hypercube.cube.animateMove({ move }))
	// keyboard.use(tpsKeyMap, tps => hypercube.cube.updateAnimationOptions(options => ({ ...options, tps })))
	keyboard.use(commandsKeyMap(hypercube), command => command())
}

const tpsKeyMap = {
	"1": 1,
	"2": 5,
	"3": 10,
	"4": 20,
	"5": Infinity
}

const commandsKeyMap = (hypercube) => ({
	"Enter": async () => await hypercube.cube.reset(false),
	" ": async () => await hypercube.cube.reset(true),
	"ArrowRight": () => hypercube.moveCamera({ x: 2 }),
	"ArrowLeft": () => hypercube.moveCamera({ x: -2 }),
})
