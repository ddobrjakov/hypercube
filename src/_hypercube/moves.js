import { isArray, isString } from 'lodash'

/* 
	### Move
	`Move` is a combination of `Face` and `Rotation`.
	Examples: Rw2 = (r, 2), D2' = (D, -2), z = (z, 1), F' = (F, -1)

	### Rotation
	`Rotation` is a whole number (usually in the range of -3 to 3 inclusively, but can be any number).
	`Rotation Direction` is either normal ("") or inverted ("'"), depending if the number is positive.
	`Rotation Turns` is its absolute value – the positive number of turns to make the rotation (ignoring direction).

	### Face formats
	MIN Format:     r  U r'  U r  U2 r'
	WCA Format:     Rw U Rw' U Rw U2 Rw'

	### Rotation formats
	Sometimes we want to keep the move's direction and the exact number of physical turns in that direction (e.g. for animation).
	In other cases we don't need this extra information, thus different `Rotation Formats`:
	* ORIGINAL:     U7   R6   D3'  F2   B   x2'
	* NORMALIZED:   U'   R2   D    F2   B   x2
	* BOUND2:       U'   R2   D    F2   B   x2'
	* BOUND3:       U3   R2   D3'  F2   B   x2'
	* CCW:          U'   R2'  D3'  F2'  B3' x2'
	* CW:           U3   R2   D    F2   B   x2
*/

const rotationTurns = rotation => Math.abs(rotation)
const rotationDirection = rotation => rotation > 0 ? "" : "'"
const rotationToString = rotation => ((rotationTurns(rotation) !== 1) ? rotationTurns(rotation) : "") + rotationDirection(rotation)
const rotationFromTurnsAndDirection = (turns, direction) => turns * (direction ? -1 : 1)
const rotationFromString = rotationString => { 
	const rotationMatch = rotationString.match(/(?<turns_before>\d*)(?<direction>'?)(?<turns_after>\d*)/)
	if (rotationMatch == undefined) 
		throw new Error(`Rotation string cannot be parsed: "${moveString}"`)
	const { turns_before, turns_after, direction } = rotationMatch.groups
	if (turns_before && turns_after)
		throw new Error(`Rotation string cannot be parsed (incorrect format): "${rotationString}"`)
	const turns = Number(turns_before || turns_after || 1)
	return rotationFromTurnsAndDirection(turns, direction)
}

const faceToMIN = face => face.replace(/([RUFLDB])w/g, (_match, p1) => p1.toLowerCase())
const faceToWCA = face => face.replace(/[rufldb]/g, p1 => p1.toUpperCase() + 'w')
const moveToMin = (moveString, format) => createMove(moveString).minString(format)
const moveToWCA = (moveString, format) => createMove(moveString).wcaString(format)

/** Parse face and rotation of move string. */
function parseMoveString(moveString) {
	const moveMatch = moveString.match(/(?<face>(?:[RUFLDB]w?|[rufldbMSExyz]))(?<turns_before>\d*)(?<direction>'?)(?<turns_after>\d*)/)
	if (moveMatch == undefined) 
		throw new Error(`Move string cannot be parsed: "${moveString}"`)
	const { face, turns_before, turns_after, direction } = moveMatch.groups
	if (turns_before && turns_after)
		throw new Error(`Move string cannot be parsed (incorrect rotation format): "${moveString}"`)
	const turns = Number(turns_before || turns_after || 1)
	return { face, rotation: turns * (direction ? -1 : 1) }
}

export function createMove(moveString) {
	const { face: originalFace, rotation: originalRotation } = parseMoveString(moveString)
	const _createMove = (originalFace, originalRotation) => {
		const move = {
			/** Move face that was used to initialize. */
			get originalFace() { return originalFace },
			/** Move face in MIN format (example: "r"). */
			get minFace() { return faceToMIN(originalFace) },
			/** Move face in WCA format (example: "Rw"). */
			get wcaFace() { return faceToWCA(originalFace) },
			/** ( -inf, inf ) range. Same as `originalRotation` with a different name. */
			get rotation() { return move.originalRotation },
			/** ( -inf, inf ) range. Move rotation that was used to initialize. */
			get originalRotation() { return originalRotation },
			/** [ 0, 3 ] range. Clockwise rotation that has the same effect. */
			get cwRotation() { return (move.rotation > 0) ? (move.rotation % 4) : (4 + move.rotation) % 4 },
			/** [ -3, 0 ] range. Counter-clockwise rotation that has the same effect. */
			get ccwRotation() { return (move.rotation < 0) ? (move.rotation % 4) : (-4 + move.rotation) % 4 },
			/** [ -3, 3 ] range. 3-turns-max rotation (original direction) that has the same effect. */
			get bound3Rotation() { return move.rotation % 4 },
			/** [ -2, 2 ] range. 2-turns-max rotation (original direction for double moves) that has the same effect. */
			get bound2Rotation() {
				const rotation = move.rotation % 4
				if (rotation < -2) return 4 + rotation
				if (rotation > 2) return -4 + rotation
				return rotation
			},
			/** [ -1, 2 ] range. Normalized rotation (WCA-style, clockwise-only double moves). */
			get normalizedRotation() {
				const rotation = move.cwRotation
				return (rotation === 3) ? -1 : rotation
			},
			/** 
			 * @param {'normalized'|'original'|'bound2'|'bound3'|'ccw'|'cw'} rotationFormat Format.
			 * @returns Rotation in specified format.
			 * @description
			 * ### Rotation Formats.
			 *
			 * 	ORIGINAL:     "U7  R6  D3' F2  B   x2'"
			 * 	NORMALIZED:   "U'  R2  D   F2  B   x2"
			 * 	BOUND2:       "U'  R2  D   F2  B   x2'"
			 * 	BOUND3:       "U3  R2  D3' F2  B   x2'"
			 * 	CCW:          "U'  R2' D3' F2' B3' x2'"
			 * 	CW:           "U3  R2  D   F2  B   x2"
			 */
			rotationInFormat: (rotationFormat) => {
				if (rotationFormat === 'normalized') return move.normalizedRotation
				if (rotationFormat === 'original') return move.originalRotation
				if (rotationFormat === 'bound2') return move.bound2Rotation
				if (rotationFormat === 'bound3') return move.bound3Rotation
				if (rotationFormat === 'ccw') return move.ccwRotation
				if (rotationFormat === 'cw') return move.cwRotation
				if (rotationFormat == undefined) throw new Error('Unspecified rotation format.')
				throw new Error(`Unknown rotation format: "${rotationFormat}"`)
			},
			/** Clockwise or counter-clockwise direction of the rotation. */
			rotationDirection,
			/** Positive number of turns in the rotation. */
			rotationTurns,
			/** Move string in MIN format (example: "f2"). */
			minString: (rotationFormat = 'normalized') => (move.rotationInFormat(rotationFormat) !== 0)
				? move.minFace + rotationToString(move.rotationInFormat(rotationFormat)) : "",
			/** Move string in WCA format (example: "Fw2"). */
			wcaString: (rotationFormat = 'normalized') => (move.rotationInFormat(rotationFormat) !== 0)
				? move.wcaFace + rotationToString(move.rotationInFormat(rotationFormat)) : "",
			/** Move string that was used to initialize. */
			get originalString() { return moveString },
			/** If this move does nothing. */
			get doesNothing() { return move.normalizedRotation === 0 },
			get inverted() { return _createMove(originalFace, originalRotation * -1) }
		}
		return move
	}
	return _createMove(originalFace, originalRotation)
}

/** Create multiple moves. */
export function createMoves(moves) {
	let movesStrings
	if (isString(moves))
		movesStrings = moves.replace(/ +(?= )/g, '').trim().split(' ')
	else if (isArray(moves) && (moves.length === 0 || isString(moves[0])))
		movesStrings = moves
	else throw new Error(`Cannot create moves, unrecognized type of argument: ${moves}`)
	const movesObject = {
		get movesStrings() { return [ ...movesStrings ] },
		get movesArray() { return movesStrings.map(moveString => createMove(moveString)) },
		minString: (rotationFormat = 'normalized') => movesObject.movesArray.map(move => move.minString(rotationFormat)).filter(moveString => moveString !== "").join(' '),
		wcaString: (rotationFormat = 'normalized') => movesObject.movesArray.map(move => move.wcaString(rotationFormat)).filter(moveString => moveString !== "").join(' '),
		get originalString() { return movesObject.movesStrings.join(' ') } 
	}
	return movesObject
}
