import { moves, U1, U9, L1, L9, F1, F9, R1, R9, B1, B9, D1, D9 } from './pieces'
import { range, rotateIndicesCW as rotate, extractSubarray } from '../utils'
import { multiply, invert } from '../array-arithmetics'
import { createMove, createMoves } from '../moves'

export class CubeState {
	constructor(stickers) {
		this.stickers = stickers ? [...stickers] : range(0, 53)
	}

	makeMove(moveStr) {
		const formattedStr = createMove(moveStr).minString('normalized')
		const move = moves[formattedStr]; if (!move) { return }
		for (const cycle of move) rotate(this.stickers, cycle)
		return this
	}

	makeMoves(movesStr) {
		const movesStrs = createMoves(movesStr).movesStrings
		for (const moveStr of movesStrs)
			this.makeMove(moveStr)
		return this
	}

	undoMove(moveStr) {
		return this.subtract((new CubeState()).makeMove(moveStr))
	}

	undoMoves(movesStr) {
		return this.subtract((new CubeState()).makeMoves(movesStr))
	}

	get printed() { return stickers.map(sticker => [...'ULFRBD'][~~(sticker / 9)]).join('') }
	copy() { return new CubeState([...this.stickers]) }
	reset() { this.stickers = range(0, 53) }
	add(state) { return new CubeState(multiply(this.stickers, state.stickers)) }
	inverse() { return new CubeState(invert(this.stickers)) }
	subtract(state) { return this.add(state.inverse()) }

	isSolved() {
		const sameColor = array => array.every(element => ~~(element / 9) === ~~(array[0] / 9))
		const faceStickers = (from, to) => extractSubarray(this.stickers, range(from, to))
		return sameColor(faceStickers(U1, U9))
			&& sameColor(faceStickers(L1, L9))
			&& sameColor(faceStickers(F1, F9))
			&& sameColor(faceStickers(R1, R9))
			&& sameColor(faceStickers(B1, B9))
			&& sameColor(faceStickers(D1, D9))
	}

}
