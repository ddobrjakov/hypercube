import { U, R, F, L, D, B } from '../CubeState/pieces'

const TOTAL_STICKERS = 54
const TOP_CENTER = U[0]
const LEFT_CENTER = L[0]
const FRONT_CENTER = F[0]
const RIGHT_CENTER = R[0]
const BACK_CENTER = B[0]
const BOTTOM_CENTER = D[0]
const NO_LOGO = -1

const oneLogo = position => (arr => (arr[position] = 0, arr))(Array(TOTAL_STICKERS).fill(NO_LOGO))

export default {
	presets: {
		NO_LOGOS: Array(TOTAL_STICKERS).fill(NO_LOGO),
		MAIN: oneLogo(TOP_CENTER),
		TOP: oneLogo(TOP_CENTER),
		LEFT: oneLogo(LEFT_CENTER),
		FRONT: oneLogo(FRONT_CENTER),
		RIGHT: oneLogo(RIGHT_CENTER),
		BACK: oneLogo(BACK_CENTER),
		BOTTOM: oneLogo(BOTTOM_CENTER)
	}
}
