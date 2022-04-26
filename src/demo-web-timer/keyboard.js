import { createTrigger, movesKeyMap, randomScramble } from '@hyper/shared'
import { moveRequests } from './commands'

export function connect(hypercube, dom) {
    const requests = moveRequests(hypercube)
	const keyboard = createTrigger(trigger => {
		$(dom).on('keydown', e => {
			if (!trigger(e.key).success)
				console.log(`No binding for key '${e.key}'`)
		})
	})
    keyboard.use(movesKeyMap(), data => requests.moveRequest(data.move))
	keyboard.use(tpsKeyMap, tps => hypercube.cube.updateAnimationOptions(options => ({ ...options, tps: tps })))
    keyboard.useKey(' ', data => requests.scrambleRequest(randomScramble(25), { tps: 15 }))
}

const tpsKeyMap = {
    "1": 5,
    "2": 10,
    "3": 15,
    "4": 20,
    "5": Infinity
}
