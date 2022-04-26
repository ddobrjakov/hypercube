import * as THREE from 'three'

export default {
	presets: {
		MAIN: {
			name: "MeshPhysicalMaterial",
			color: 0xffffff,
			metalness: 0,
			roughness: 0,
			clearcoat: 1,
		}
	},
	parse: plain => {
		const { name, color, metalness, roughness, clearcoat } = plain
		if (name !== "MeshPhysicalMaterial") throw new Error(`Material "${name}" is not supported.`)
		return new THREE.MeshPhysicalMaterial({ color, metalness, roughness, clearcoat, vertexColors: THREE.FaceColors })
	}
}
