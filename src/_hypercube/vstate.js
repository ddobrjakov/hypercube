/*
	Imagine that the cube is scrambled, and a frustrated user wants to just click a button and make it back to the good old times when the cube was nice and solved.
	Such immediate state changes to the cube can be more efficiently implemented by just changing the stickers rather than moving and rotating heavy pieces around.
	vState lets you change the cube state without moving the pieces. It keeps both the perceived state of the cube and the actual state of its physical pieces,
	and does a seamless conversion between them. By doing that, it adds a level of abstraction to avoid working with physical pieces directly.
*/

import { range } from './utils'
import { CubeState } from './CubeState'
import { createMove, createMoves } from './moves'
import { divideL, invert } from './array-arithmetics'

/** Create vState. */
export default function vState(fstickers, fcolor, flogo) {

	var _rstate = new CubeState()
	var _fstate = new CubeState(fstickers)
	var _fcolor = [ ...fcolor ]
	var _flogo = [ ...flogo ]

	const _converter = divideL
	const converter = () => divideL(_rstate.stickers, _fstate.stickers)
	const convertArrByID = (arr, convert) => range(0, arr.length - 1).map(i => arr[invert(convert)[i]])

	/**
	 * Set fstate.
	 * @param {Function} set Function that updates fstate.
	 * @param {Object} options Options.
	 * @param {Boolean} options.updatestate Update fstate.
	 * @param {Boolean} options.updatelogo Leave logo on the same rsticker (as opposed to moving with fsticker). If set to true, logos will not visually change.
	 * @param {Boolean} options.updatecolor Leave color on the same rsticker (as opposed to moving with fsticker). If set to true, colors will not visually change.
	 */
	function fset(set, { updatestate, updatecolor = false, updatelogo = false }) {
		const statebefore = _fstate.copy()
		const stateafter = set(_fstate.copy()) ?? statebefore
		if (updatestate) _fstate = stateafter
		if (!updatecolor && !updatelogo) return
		const convert = _converter(stateafter.stickers, statebefore.stickers)
		if (updatecolor) _fcolor = convertArrByID(_fcolor, convert)
		if (updatelogo) _flogo = convertArrByID(_flogo, convert)
	}

	return {

		get rstickers() { return [ ... _rstate.stickers ] } ,

		get fstickers() { return [ ... _fstate.stickers ] },

		get rstate() { return _rstate.copy() } ,

		get fstate() { return _fstate.copy() },

		get fcolor() { return _fcolor },

		get rcolor() { return convertArrByID( _fcolor, converter() ) },

		get flogo() { return _flogo },

		get rlogo() { return convertArrByID( _flogo, converter() ) },

		get convert() { return converter() },

		fset,

		freset: options => fset( fstate => fstate.reset(), options ),

		fcolorset: colorMask => { _fcolor = colorMask },

		flogoset: logoMask => { _flogo = logoMask },

		makeMove: move => { 
			const mnMove = createMove(move).minString('normalized')
			_rstate.makeMove(mnMove)
			_fstate.makeMove(mnMove)
		},

	}

}
