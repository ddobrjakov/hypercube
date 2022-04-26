import * as THREE from 'three'
import * as math from 'mathjs'

///////////////////////////////////////////////////////////////
/// Create move animation
///////////////////////////////////////////////////////////////

function makeRotationMatrix4(rotationMatrix3) {
    var xAxis = new THREE.Vector3(),
        yAxis = new THREE.Vector3(),
        zAxis = new THREE.Vector3()
    const _ = (new THREE.Matrix3())
        .fromArray(rotationMatrix3.toArray().flat())
        .extractBasis(xAxis, yAxis, zAxis)
    return (new THREE.Matrix4()).makeBasis(xAxis, yAxis, zAxis)
}

function rotationQuaternion(move) {
	return (new THREE.Quaternion())
        .setFromRotationMatrix(makeRotationMatrix4(move.rotationMatrix))
}

function rotationKeyframeTrack(move, tps) {
    const times = [0, 1 / tps]
    const values = []
    const startQuaternion = new THREE.Quaternion()
    const endQuaternion = !move.inv ? rotationQuaternion(move) : rotationQuaternion(move).invert()
    startQuaternion.toArray(values, values.length)
    endQuaternion.toArray(values, values.length)
    return new THREE.QuaternionKeyframeTrack('.quaternion', times, values)
}

function rotationAnimationClip(move, tps) {
    const duration = -1
    const tracks = [rotationKeyframeTrack(move, tps)]
    return new THREE.AnimationClip('rotation', duration, tracks)
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

/** Select pieces that are affected by the move. */
function findPieces(uiPieces, move) {
	const pieceHasCoords = (uiPiece, coords) => {
		return uiPiece.userData.coords.x === coords.x
			&& uiPiece.userData.coords.y === coords.y
			&& uiPiece.userData.coords.z === coords.z
	}
	return uiPieces.filter(uiPiece => (move.coords.find(coords => pieceHasCoords(uiPiece, coords)) != undefined))
}

/** Apply move to a piece. */
function rotatePiece(uiPiece, move) {
    const coordsFrom = math.matrix([uiPiece.userData.coords.x, uiPiece.userData.coords.y, uiPiece.userData.coords.z])
    const coordsTo = math.multiply(coordsFrom, move.rotationMatrix)
    uiPiece.userData.coords = { x: coordsTo.get([0]), y: coordsTo.get([1]), z: coordsTo.get([2]) }
    uiPiece.applyMatrix4(makeRotationMatrix4(move.rotationMatrix))
}

/** Make a move with no animation. */
export function instantMove(uiPieces, move, render) {
    const movePieces = findPieces(uiPieces, move)
    for (let uiPiece of movePieces) rotatePiece(uiPiece, move)
    render()
}

/** Make a series of moves witn no animation. */
export function instantMoves(uiPieces, moves, render, { mscb, mecb, cb }) {

    for (let i = 0; i < moves.length; i++) {
        const mdata = { move: moves[i].string, isLast: i === moves.length - 1 }
        mscb?.(mdata)
        instantMove(uiPieces, moves[i], render)
        mecb?.(mdata)
    }

    cb?.({ moves: moves.map(move => move.string) })

}

/** Make a move with animation. */
export function animateMove({ cube3D: { uiPiecesGroup, uiPieces }, move, render, options, callback }) {
    
    const createMoveGroup = (movePieces) => {
        const group = new THREE.Group()
        movePieces.forEach(mesh => group.add(mesh))
        return group
    }

    const moveBetweenGroups = (from, to) => {
        for (let child of [...from.children]) to.attach(child)
    }

    const initAnimation = (moveGroup) => {
        mixer = new THREE.AnimationMixer(moveGroup)
        clip = rotationAnimationClip(move, options.tps)
        action = mixer.clipAction(clip, moveGroup)
        action.clampWhenFinished = false
        action.startAt(0); action.setLoop(THREE.LoopOnce)
        return { mixer, clip, action }
    }

    var done = false
    const movePieces = findPieces(uiPieces, move)
    const moveGroup = createMoveGroup(movePieces)
    uiPiecesGroup.add(moveGroup)
    
    const clock = new THREE.Clock()
    var { mixer, clip, action } = initAnimation(moveGroup)
    mixer.addEventListener('finished', onFinished)
    action.play()
    animate()

    function animate(time) {
        mixer.update(clock.getDelta())
        render()
        if (!done) requestAnimationFrame(animate)
    }

    function onFinished(e) {
        action.stop()
        moveBetweenGroups(moveGroup, uiPiecesGroup)
        uiPiecesGroup.remove(moveGroup)
        instantMove(uiPieces, move, render)
        done = true
        callback?.()
    }
}

/** Make a series of moves with animation. */
export function animateMoves({ cube3D, moves, render, options, mscb, mecb, cb }) {
    
    const animateRemaining = ([next, ...scheduled]) => {
        if (!next) cb?.({ moves: moves.map(move => move.string) })
        else { 
            const mdata = { move: next.string, isLast: !scheduled }
            mscb?.(mdata)
            animateMove({ cube3D, move: next, render, options, callback: () => { 
                mecb?.(mdata)
                animateRemaining(scheduled) 
            } }) 
        }
    }

    options.tps === Infinity
        ? instantMoves(cube3D.uiPieces, moves, render, { mscb, mecb, cb })
        : animateRemaining(moves)

}

/** Control animation requests by putting new requests in the queue when animation is active. */
export function controlAnimation(animateMoves) {
    let isAnimationActive = false
    const queue = []
    function requestAnimation({ cb, ...args }) {
        if (isAnimationActive) { queue.push(arguments); return }
        isAnimationActive = true
        animateMoves({ ...args, cb: data => {
            isAnimationActive = false
            cb?.(data)
            if (queue.length) requestAnimation(...queue.shift())
        }})
    }
    return { requestAnimation, isAnimationActive }
}
