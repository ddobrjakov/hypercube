import { createUiCube, colorizePiece, createLogoMesh, attachUiLogo } from './uicube'
import { CubeState, resetStickersRotation, matchCubeRotation } from './CubeState'
import vState from './vstate'
import { controlAnimation, animateMoves } from './animation'
import { geometryMoves } from './geometry'
import { range } from './utils' 
import { invert, divideL, divideR, multiply } from './array-arithmetics'
import { events } from './events'

/**
 * Create API for uiCube.
 * @param {Object} args Arguments.
 * @param {THREE.Material} args.material Cube material.
 * @param {Array<number>} args.stickers position -> sticker.
 * @param {Object.<number, string>} args.colorMask sticker -> colorID.
 * @param {Object.<string, THREE.Color>} args.colorVector colorID -> THREE.Color.
 * @param {Object.<number, string>} args.logoMask sticker -> logoID.
 * @param {Object.<number, string>} args.logoVector logoID -> path to logo.
 * @param {Function} args.render THREE.JS render function.
 */
export async function createCube({ material, stickers, colorMask, colorVector, logoMask, logoVector, animationOptions, render }) {
	/** Some of the settings. */
	const settings = { material, colorVector, logoVector, animationOptions }

	/** Virtual state. */
	const vstate = vState( [ ...stickers ], [ ...colorMask ], [ ...logoMask ] )

	/** uiPiecesGroup (`THREE.Group` of `THREE.Mesh`es). */
	const uiPiecesGroup = await createUiCube({ material, colorMask, colorVector, logoMask, logoVector })
	
	/** uiPieces (`THREE.Mesh`es) of uiCube. */
	const uiPieces = [...uiPiecesGroup.children]

	/** Colorize the uiCube with given colorMask and colorVector.  */
	function colorize(colorMask, colorVector, refresh = true) {
		for (let uiPiece of uiPieces) 
			colorizePiece(uiPiece, colorMask, colorVector, refresh)
	}

	/** Events (animation). */
	const e = events()

	/** Animation. */
	const animation = controlAnimation(animateMoves)

	const cube = {
		
		/** uiPiecesGroup (`THREE.Group` of `THREE.Mesh`es). */
		uiPiecesGroup,

		/** uiPieces (`THREE.Mesh`es) of uiCube. */
		uiPieces,

		/** Get uiLogos (`THREE.Mesh`es) of uiCube. */
		uiLogos: () => uiPieces
			.flatMap(uiPiece => uiPiece.children)
			.filter(child => child.userData.type === 'logo'),

		/** Find uiPiece at position. */
		getUiPiece: (position) => uiPieces.find(uiPiece => 
			Object.values(uiPiece.userData.stickers).includes(position.physicalSticker)),

		/** Find uiLogo at position. */
		getUiLogo(position) { 
			return this.uiLogos().find(uiLogo => uiLogo.userData.sticker === position.physicalSticker) 
		},

		/** Positions. */
		position: cubePositions(vstate),

		/* Colors are attached to stickers. */

		getColor: (position) => vstate.fcolor[position.sticker],

		setColor(position, colorID, refresh = true) { 
			vstate.fcolor[position.sticker] = colorID
			if (refresh) { this.refreshColors(); render() }
		},
		
		getColors: (positions) => multiply(positions.stickers, [ ...vstate.fcolor ]),

		setColors(positions, colorMask, refresh = true) {
			vstate.fcolorset(divideL(colorMask, positions.stickers))
			if (refresh) { this.refreshColors(); render() }
		},

		getColorVector: () => ({ ...settings.colorVector }),

		setColorVector(colorVector, refresh = true) { 
			settings.colorVector = colorVector
			if (refresh) { this.refreshColors(); render() }	
		},

		refreshColors: () => colorize(vstate.rcolor, settings.colorVector, true),

		/* Logos (like colors) are attached to stickers. */

		getLogo: (position) => vstate.flogo[position.sticker],

		async setLogo(position, logoID, refresh = true) { 
			vstate.flogo[position.sticker] = logoID
			if (refresh) { await this.refreshLogos(); render() }
		},

		getLogos: (positions) => multiply(positions.stickers, [ ...vstate.flogo ]),

		async setLogos(positions, logoMask, refresh = true) { 
			vstate.flogoset(divideL(logoMask, positions.stickers))
			if (refresh) { await this.refreshLogos(); render() }
		},

		getLogoVector: () => ({ ...settings.logoVector }),

		async setLogoVector(logoVector, refresh = true) {
			settings.logoVector = logoVector
			if (refresh) { this.destroyLogos(); await this.refreshLogos(); render() }
		},

		async refreshLogos() {
			const availableLogos = new Set(this.uiLogos())
			
			for (const [ realStickerID, logoID ] of vstate.rlogo.entries()) {
				
				const attachedLogo = this.getUiLogo(this.position.byPhysicalSticker(realStickerID))
				const attachedLogoID = this.getLogo(this.position.byPhysicalSticker(realStickerID))
				const targetPiece = this.getUiPiece(this.position.byPhysicalSticker(realStickerID))

				/* No logo => remove attached logo and continue. */
				if (logoID < 0 || logoID === '-') {
					if (attachedLogo != undefined) 
						targetPiece.remove(attachedLogo)
					continue
				}

				/* No changes => delete from available and continue. */
				if (attachedLogo != undefined && logoID === attachedLogoID) {
					availableLogos.delete(attachedLogo)
					continue
				}

				/* Unknown logoID => throw error. */
				if (settings.logoVector[logoID] == undefined) 
					throw new Error('Unknown logo id: ' + logoID)

				/* Try to find logo with logoID among available logos. */
				const availableLogo = [...availableLogos].find(uiLogo => uiLogo.userData.id === logoID)
				if (availableLogo != undefined) availableLogos.delete(availableLogo)
				
				/* Create and attach new (or reuse available) logo. */
				const logo = availableLogo != undefined
					? availableLogo
					: await createLogoMesh(settings.logoVector[logoID], { id: logoID, type: 'logo' }) 
				attachUiLogo(logo, targetPiece, realStickerID)

			}
		},

		/** Untested. */
		destroyLogos() {
			for (const uiLogo of this.uiLogos()) {
				uiLogo.parent.remove(uiLogo)
				uiLogo.geometry.dispose()
				uiLogo.material.dispose()
				// renderer.renderLists.dispose()
				// https://discourse.threejs.org/t/correctly-remove-mesh-from-scene-and-dispose-material-and-geometry/5448/2
			}
		},

		/* Stickers are attached to positions. */

		getSticker: (position) => vstate.fstickers[position.id],

		getStickers: (positions) => multiply(positions.ids, [ ...vstate.fstickers ]),

		async setStickers(positions, stickers, refresh = true) {
			const [ updatestate, updatecolor, updatelogo ] = [ true, false, false ]
			vstate.fset(_state => new CubeState(divideL(stickers, positions.ids)), { updatestate, updatecolor, updatelogo })
			if (refresh) { this.refreshColors(); await this.refreshLogos(); render() }
		},

		/* State. */

		getState: () => vstate.fstate,

		async updateState(set, updatecolor = false, updatelogo = false, refresh = true) {
			vstate.fset(set, { updatestate: true, updatecolor, updatelogo })
			if (refresh) { this.refreshColors(); await this.refreshLogos(); render() }
		},

		async makeMoves(moves, refresh = true) {
			/* TODO: Consistent logo rotations. */
			const [ updatestate, updatecolor, updatelogo ] = [ true, false, false ]
			vstate.fset(fstate => fstate.makeMoves(moves), { updatestate, updatecolor, updatelogo })
			if (refresh) { this.refreshColors(); await this.refreshLogos(); render() }
		},

		async reset(respectOrientation = false, refresh = true) {
			const resetState = fstate => respectOrientation ? matchCubeRotation(new CubeState(), fstate) : new CubeState()
			const [ updatestate, updatecolor, updatelogo ] = [ true, false, false ]
			vstate.fset(resetState, { updatestate, updatecolor, updatelogo })
			if (refresh) { this.refreshColors(); await this.refreshLogos(); render() }
		},

		/* Physical stickers. */

		getPhysicalSticker: (position) => vstate.rstickers[position.id],

		getPhysicalStickers: (positions) => multiply(positions.ids, [ ...vstate.rstickers ]),

		/* Animation. */

		getAnimationOptions: () => animationOptions,

		updateAnimationOptions: (update) => animationOptions = update(animationOptions),

		/**
		 * Animate a sequence of moves.
		 * @param {Object} arg Arguments
		 * @param {string|Array<string>} arg.moves Moves to animate
		 * @param {Object} arg.options Animation options ({ tps, sound })
		 * @param {Function} arg.onMoveStart Callback – Move animation started
		 * @param {Function} arg.onMoveEnd Callback – Move animation ended
		 * @param {Function} arg.onAnimationEnd Callback – Animation ended
		 */
		animateMoves({ moves, options, onMoveStart, onMoveEnd, onAnimationEnd }) {
			animation.requestAnimation({
				cube3D: { uiPiecesGroup, uiPieces },
				moves: geometryMoves(moves),
				render: render,
				options: { ...animationOptions, ...options },
				mscb: data => { onMoveStart?.(data); e.raise('moveStart', data) },
				mecb: data => { vstate.makeMove(data.move); onMoveEnd?.(data); e.raise('moveEnd', data) },
				cb: data => { onAnimationEnd?.(data); e.raise('animationEnd', data) }
			})
		},

		animateMove({ move, ...rest }) {
			this.animateMoves({ ...rest, moves: move })
		},

		animateInstantMoves({ options, ...rest }) {
			this.animateMoves({ options: { ...options, tps: Infinity }, ...rest })
		},

		onAnimationEvent: e.onEvent,
	}

	return cube
}

function cubePositions(vstate) {

	const stickerAtPosition = position => vstate.fstickers[position]
	const stickersAtPosition = () => vstate.fstickers
	const positionBySticker = sticker => stickersAtPosition().findIndex(s => s === sticker)
	const positionsBySticker = () => invert(stickersAtPosition())
	const physicalStickerAtPosition = position => vstate.rstickers[position]
	const physicalStickersAtPosition = () => vstate.rstickers
	const positionByPhysicalSticker = physicalSticker => physicalStickersAtPosition().findIndex(phSticker => phSticker === physicalSticker)
	const positionsByPhysicalSticker = () => invert(physicalStickersAtPosition())
	const resetRotation = () => divideR(resetStickersRotation(vstate.fstickers), vstate.fstickers)

	function position(id) {
		return {
			get id() { return id },
			get sticker() { return stickerAtPosition(id) },
			get physicalSticker() { return physicalStickerAtPosition(id) },
			resetRotation: () => position(resetRotation()[id]),
			transform: (targetStickers) => position(divideR(targetStickers, vstate.fstickers))
		}
	}

	function positions(ids) {
		return {
			get ids() { return ids },
			get stickers() { return ids.map(id => position(id).sticker) },
			get physicalStickers() { return ids.map(id => position(id).physicalSticker) },
			resetRotation: () => positions(multiply(ids, resetRotation())),
			toArray: () => ids.map(id => position(id)),
			get: index => position(ids[index]),
		}
	}

	return { 
		byID: id => position(id),
		bySticker: sticker => position(positionBySticker(sticker)),
		byPhysicalSticker: physicalSticker => position(positionByPhysicalSticker(physicalSticker)),
		byIDs: () => positions(range(0, 53)),
		byStickers: () => positions(positionsBySticker()),
		byPhysicalStickers: () => positions(positionsByPhysicalSticker()),
		byCustomIDs: (ids) => positions(ids),
	}

}
