import * as THREE from 'three'
import { objectMap } from '../utils'

export default {
	presets: {
		/* Standard */
		STANDARD: {
			'U': 'ghostwhite',
			'D': 'yellow',
			'L': 'darkorange',
			'R': 'red',
			'F': 'green',
			'B': 'blue',
			'-': 0x282828
		},
		/* Black and pink */
		PINK: {
			'U': 'aliceblue',
			'D': 'yellow',
			'L': 'darkorange',
			'R': 'indianred',
			'F': 'green',
			'B': 'black',
			'-': 0x282828
		},
		/* Dark */
		DARK: {
			'U': 'white',
			'D': 'yellow',
			'L': 0xff6300,
			'R': 0xd00000,
			'F': 0x216321,
			'B': 'black',
			'-': 0x282828
		}
	},
	parse: plain => objectMap(plain, str => new THREE.Color(str))
}
