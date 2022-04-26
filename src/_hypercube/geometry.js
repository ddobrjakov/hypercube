import * as math from 'mathjs'
import { 
	UR, UF, UL, UB, DR, DF, DL, DB, FL, FR, BL, BR,
	URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB,
	U, R, F, D, L, B
} from './CubeState/pieces'
import { createMove, createMoves } from './moves'

const [ cmin, cmid, cmax ] = [ -1, 0, 1 ]

const coordsOnFace = coords => ({
    'U': coords.y === cmax,
    'D': coords.y === cmin,
    'E': coords.y === cmid,
    'R': coords.x === cmax,
    'L': coords.x === cmin,
    'M': coords.x === cmid,
    'F': coords.z === cmax,
    'B': coords.z === cmin,
    'S': coords.z === cmid,
    'x': true,
    'y': true,
    'z': true,
    'l': coords.x < cmax,
    'r': coords.x > cmin,
    'u': coords.y > cmin,
    'd': coords.y < cmax,
    'f': coords.z > cmin,
    'b': coords.z < cmax
})

/** All coordinates of the cube. */
export const coordsAll = Array.from((function* () {
    const values = [cmin, cmid, cmax]
    for (let x of values)
        for (let y of values)
            for (let z of values) yield { x, y, z }
})())

/** Coordinates of the cube that are facing the given side. */
const faceCoords = face => coordsAll.filter(coords => coordsOnFace(coords)[face])

/** Faces of the cube that a piece at given coordinates has. */
const pieceFaces = coords => Object.fromEntries(
    Object.entries(coordsOnFace(coords)).map(([face, exists]) => 
        [face, exists ? face : '-']))

const geometricPieces = [
	DBL, DL, DLF, BL, L, FL, ULB, UL, UFL, 
	DB, D, DF, B, null, F, UB, U, UF, 
	DRB, DR, DFR, BR, R, FR, UBR, UR, URF
]

const pieceStickers = pieceID => {
	const pieceFacelets = geometricPieces[pieceID]
	const pieceStickers = Object.fromEntries([...'ULFRBD'].map(face => ([face, null])))
	if (!pieceFacelets) return pieceStickers
	for (let facelet of pieceFacelets) pieceStickers[faceletFace(facelet)] = facelet
	return pieceStickers
}

/** To draw color on the correct side of the uiPiece. */
const faceletFace = sticker => [...'ULFRBD'][~~(sticker / 9)]

/** Some information (faces, coordinates) of all pieces on the cube. */
export const allPieces = coordsAll.map((coords, index) => ({
    id: index,
    coords: coords,
    faces: pieceFaces(coords),
    facesList: Object.keys(coordsOnFace(coords))
        .filter(face => coordsOnFace(coords)[face]),
	stickers: pieceStickers(index)
}))

/** Rotation matrices. */
const rotationMatrices = [
    math.matrix([[1, 0, 0], [0, 0, 1], [0, -1, 0]]), // R' / L 
    math.matrix([[0, 0, -1], [0, 1, 0], [1, 0, 0]]), // U' / D
    math.matrix([[0, 1, 0], [-1, 0, 0], [0, 0, 1]]), // F' / B 
].map(matrix => [matrix, math.multiply(matrix, matrix), math.multiply(matrix, matrix, matrix)])


/** Find rotation matrix for the move. */
const moveRotationMatrix = (face, numRotations) => {
    var matrix = undefined
    'LlM'.includes(face) && (matrix = rotationMatrices[0][numRotations - 1])
    'Rrx'.includes(face) && (matrix = rotationMatrices[0][3 - numRotations])
    'DdE'.includes(face) && (matrix = rotationMatrices[1][numRotations - 1])
    'Uuy'.includes(face) && (matrix = rotationMatrices[1][3 - numRotations])
    'Bb'.includes(face) && (matrix = rotationMatrices[2][numRotations - 1])
    'FfSz'.includes(face) && (matrix = rotationMatrices[2][3 - numRotations])
    return matrix
}

/** Get geometric information for the move. */
export const geometryMove = moveString => {
    const move = createMove(moveString)
	const [ face, cwTurns ] = [ move.minFace, move.rotationTurns(move.cwRotation) ]
	const matrix = moveRotationMatrix(face, cwTurns)
	const isCCW = move.rotationDirection(move.originalRotation) === "'"
	const invertDirection = face => 'LlMDdEBb'.includes(face)
    return {
        face, cwTurns,
		string: move.minString('original'),
        rotationMatrix: matrix,
		inv: (cwTurns === 2) && (invertDirection(face) ? isCCW : !isCCW), // Temporary workaround to invert double moves.
        coords: faceCoords(face)
    }
}

/** Get geometric information for the array of moves. */
export const geometryMoves = moves => createMoves(moves).movesStrings.map(geometryMove)
