import { movesKeyMap, createTrigger } from '@hyper/shared'
import { cubeCommands } from './commands'

export function connectKeyboard(hypercube, dom) {
	const commands = cubeCommands(hypercube)
	const keyboard = createTrigger(trigger => {
		$(dom).on('keydown', e => {
			if (!trigger(e.key).success)
				console.log(`No binding for key '${e.key}'`)
		})
	})
	keyboard.use(movesKeyMap(), ({ move }) => hypercube.cube.animateMove({ move }))
	keyboard.use(tpsKeyMap, tps => hypercube.cube.updateAnimationOptions(options => ({ ...options, tps: tps })))
	keyboard.use(commandsKeyMap(commands, hypercube), command => command())
}

const tpsKeyMap = {
	"1": 1,
	"2": 5,
	"3": 10,
	"4": 20,
	"5": Infinity
}

const commandsKeyMap = (commands, hypercube) => ({
	'Enter': () => commands.solve(),
	'Backspace': () => commands.takeBack(),
	' ': () => commands.scramble(),
	'0': () => commands.showScramble()
})
