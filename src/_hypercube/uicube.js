import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { allPieces } from './geometry' 

///////////////////////////////////////////////////////////////
/// UiLogo (THREE.JS)
///////////////////////////////////////////////////////////////

/** Change uiLogo position and rotation to make it look like it's on the sticker. */
function transformUiLogo(uiLogo, sticker) {

	const rotateSticker = {
		B: { rotate: 'y', quarters:  2, shift: 'z', units: -1 },
		F: { rotate: 'x', quarters:  0, shift: 'z', units:  1 },
		U: { rotate: 'x', quarters: -1, shift: 'y', units:  1 },
		D: { rotate: 'x', quarters:  1, shift: 'y', units: -1 },
		L: { rotate: 'y', quarters: -1, shift: 'x', units: -1 },
		R: { rotate: 'y', quarters:  1, shift: 'x', units:  1 },
	}

	const face = [...'ULFRBD'][~~(sticker / 9)]

	const transform = rotateSticker[face]
	uiLogo.rotation.x = 0; uiLogo.rotation.y = 0; uiLogo.rotation.z = 0
	uiLogo.rotation[transform.rotate] = transform.quarters * Math.PI / 2
	uiLogo.position.x = 0; uiLogo.position.y = 0; uiLogo.position.z = 0
	uiLogo.position[transform.shift] += transform.units * 1.01
	return uiLogo

}

/** Shape of the uiLogo. */
function roundedRectShape() {
    const _roundedRectShape = new THREE.Shape();
    (function roundedRect(ctx, x, y, width, height, radius) {
        ctx.moveTo( x, y + radius )
        ctx.lineTo( x, y + height - radius )
        ctx.quadraticCurveTo( x, y + height, x + radius, y + height )
        ctx.lineTo( x + width - radius, y + height )
        ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius )
        ctx.lineTo( x + width, y + radius )
        ctx.quadraticCurveTo( x + width, y, x + width - radius, y )
        ctx.lineTo( x + radius, y )
        ctx.quadraticCurveTo( x, y, x, y + radius )
    })(_roundedRectShape, -0.8, -0.8, 1.6, 1.6, 0.5)
    return _roundedRectShape
}

/** Create uiLogo. */
export async function createLogoMesh(url, userData) {
    const shape = roundedRectShape()
    const geometry = new THREE.ShapeBufferGeometry(shape)
    return new Promise((resolve, _reject) => {
        function onLoad(texture) {
            texture.anisotropy = 4
            texture.offset = new THREE.Vector2(0.5, 0.5)
            texture.repeat.set(0.75, 0.75)
            const material = new THREE.MeshPhysicalMaterial({ map: texture })
			material.transparent = true
            const logo = new THREE.Mesh(geometry, material)
			if (userData) logo.userData = userData
            resolve(logo)
        }
        new THREE.TextureLoader().load(url, onLoad)
    })
}

/** Attach uiLogo to a sticker on a uiPiece. */
export function attachUiLogo(uiLogo, uiPiece, sticker) {
	uiPiece.add(uiLogo)
	transformUiLogo(uiLogo, sticker)
	uiLogo.userData.sticker = sticker
}

///////////////////////////////////////////////////////////////
/// UiCube (THREE.JS)
///////////////////////////////////////////////////////////////

/** Set the colors of the uiPiece's geometry faces (uiFaces). */
function colorizePieceGeometry({ geometry, uiFaceStickers, colorMask, colorVector, update = true }) {
	for (const [index, uiFace] of geometry.faces.entries()) {
		const sticker = uiFaceStickers[index]
		const colorID = colorMask[sticker] ?? '-'
		uiFace.color = colorVector[colorID]
	}
	if (update) {
		geometry.colorsNeedUpdate = true
		geometry.elementsNeedUpdate = true
	}
}

/** Set the colors of the uiPiece's stickers. */
export function colorizePiece(uiPiece, colorMask, colorVector, update = true) {
	colorizePieceGeometry({ geometry: uiPiece.geometry, uiFaceStickers: uiPiece.userData.uiFaceStickers, colorMask, colorVector, update })
}

/** Create uiPiece. */
async function createPieceMesh({ pieceInfo, pieceGeometry, colorVector, colorMask, material, logoMask, logoVector }) {

	/** 
	 * Each geometry face gets an associated ID. This ID corresponds to a sticker on the cube, 
	 * which changes its position when moves are made. It allows to change colors later.
	 */
	const setupUiFaces = (geometry, stickers) => {
		const uiFaceStickers = { }
		const closeTo = (a, b) => Math.abs(a - b) <= 1e-12
		geometry.faces.forEach((face, index) => {
			closeTo(face.normal.y, 1) && (uiFaceStickers[index] = stickers['U'])
			closeTo(face.normal.y, -1) && (uiFaceStickers[index] = stickers['D'])
			closeTo(face.normal.x, -1) && (uiFaceStickers[index] = stickers['L'])
			closeTo(face.normal.x, 1) && (uiFaceStickers[index] = stickers['R'])
			closeTo(face.normal.z, 1) && (uiFaceStickers[index] = stickers['F'])
			closeTo(face.normal.z, -1) && (uiFaceStickers[index] = stickers['B'])
		})
		return uiFaceStickers
	}

	// Create THREE.Mesh of a piece.
	const colorizedGeometry = pieceGeometry.clone()
	const uiFaceStickers = setupUiFaces(colorizedGeometry, pieceInfo.stickers)
	colorizePieceGeometry({ geometry: colorizedGeometry, uiFaceStickers, colorMask, colorVector: colorVector || DEFAULT().cube_colors })
	const uiPiece = new THREE.Mesh(colorizedGeometry, material || DEFAULT().cube_material)
	uiPiece.userData = { 
		id: pieceInfo.id, 
		coords: pieceInfo.coords, 
		faces: pieceInfo.faces, 
		stickers: pieceInfo.stickers, 
		uiFaceStickers 
	}

	// Position THREE.Mesh correctly in the 3D space.
	const scale = 1.95
	uiPiece.position.x = pieceInfo.coords.x * scale
	uiPiece.position.y = pieceInfo.coords.y * scale
	uiPiece.position.z = pieceInfo.coords.z * scale

	// Attach 'uiLogo's if necessary.
	const stickers = Object.values(pieceInfo.stickers).filter(s => s != undefined)
	for (const sticker of stickers) {
		const id = logoMask[sticker]; if (id < 0) continue;
		const uiLogo = await createLogoMesh(logoVector[id], { id, type: 'logo' })
		attachUiLogo(uiLogo, uiPiece, sticker)
	}

	return uiPiece

}

/** Create uiCube as a group of uiPieces. Returns 'THREE.Group' of 'THREE.Mesh'es. */
export async function createUiCube({ material, colorMask, colorVector, logoMask, logoVector }) {

	const loadScene = url => {
		return new Promise((resolve, reject) => {
			const loader = new GLTFLoader()
			loader.load(url, gltf => resolve(gltf), undefined, reject)
		})
	}
	
	const loadPieceGeometry = async (url) => {
		const pieceScene = await loadScene(url)
		const piece = pieceScene.scene.children[0]
		const pieceGeometry = new THREE.Geometry()
		pieceGeometry.fromBufferGeometry(piece.geometry)
		return pieceGeometry
	}

	const createPiecesGroup = async pieceGeometry => {
		const piecesGroup = new THREE.Group()
		for (const pieceInfo of allPieces) {
			const pieceMesh = await createPieceMesh({ pieceInfo, pieceGeometry, colorVector, colorMask, material, logoMask, logoVector })
			piecesGroup.add(pieceMesh)
		}
		return piecesGroup
	}

	const pieceGeometry = await loadPieceGeometry('../assets/cube-bevelled.glb')
	return await createPiecesGroup(pieceGeometry)

}
