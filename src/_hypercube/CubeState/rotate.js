import { CubeState } from './CubeState'
import { U, F } from './pieces'

const TOP_CENTER = U[0]
const FRONT_CENTER = F[0]

/** Get rotated CubeState so that specified center stickers are on top and on front. */
export function rotateCube(cube, top, front) {
	const cubeCopy = cube.copy()
	/* rotate top center to the top */
	const movesTop = ['-', 'z', 'z', 'z', 'x', 'x2']
	for (let move of movesTop) {
		if (move !== '-') cubeCopy.makeMove(move)
		if (cubeCopy.stickers[TOP_CENTER] === top) break
	}
	/* rotate front center to the front */
	const movesFront = ['-', 'y', 'y', 'y']
	for (let move of movesFront) {
		if (move !== '-') cubeCopy.makeMove(move)
		if (cubeCopy.stickers[FRONT_CENTER] === front) break
	}
	return cubeCopy
}

/** Get rotated stickers so that specified center stickers are on top and on front. */
export function rotateStickers(state, top, front) {
	const cube = new CubeState(state)
	const rotated = rotateCube(cube, top, front)
	return rotated.stickers
}

/** Reset (copied) cube to initial orientation. */
export function resetCubeRotation(cube) {
	return rotateCube(cube, TOP_CENTER, FRONT_CENTER)
}

/** Reset stickers to initial orientation. */
export function resetStickersRotation(stickers) {
	return rotateStickers(stickers, TOP_CENTER, FRONT_CENTER)
}

/** Rotate cube to match another cube's rotation. */
export function matchCubeRotation(cube, cubeToMatch) {
	return rotateCube(cube, cubeToMatch.stickers[TOP_CENTER], cubeToMatch.stickers[FRONT_CENTER])
}

/** Rotate stickers to match another stickers' rotation. */
export function matchStickersRotation(stickers, stickersToMatch) {
	rotateStickers(stickers, stickersToMatch[TOP_CENTER], stickersToMatch[FRONT_CENTER])
}
