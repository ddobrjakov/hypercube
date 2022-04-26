import * as cameraControls from './camera-controls'
import createEnvironment from './environment'
import { createCube } from './cube'
import { parseOptions } from './hypercube-options'
import * as THREE from 'three'

export async function hyperCube( { w, h }, userOptions ) {
	
	const options = parseOptions(userOptions)
	const env = createEnvironment(w, h, options.cameraPosition, options.backgroundColor)
	const cube = await createCube({ 
		material: options.cubeMaterial,
		stickers: options.stickers,
		colorMask: options.colorMask,
		colorVector: options.colorVector,
		logoMask: options.logoMask,
		logoVector: options.logoVector,
		animationOptions: { tps: options.animationTPS, sound: options.animationSound },
		render: env.render
	})

	env.scene.add(cube.uiPiecesGroup)
	env.render()

	const hc = {
		/** The cube. */
		cube,

		/** Get canvas element. */
		get canvas() { return env.renderer.domElement },

		/** Resize graphics (e.g. when canvas is resized).  */
		setSize(w, h) { env.resize(w, h) },

		/** Render. */
		render: env.render,

		/** Change camera position. */
		moveCamera(vector) {
			vector.x != undefined && (env.camera.position.x += vector.x)
			vector.y != undefined && (env.camera.position.y += vector.y)
			vector.z != undefined && (env.camera.position.z += vector.z)
			env.camera.lookAt(0, 0, 0)
			env.camera.updateProjectionMatrix()
			env.render()
		},

		/** Get camera position. */
		getCameraPosition() {
			return { ...env.camera.position }
		},

		/** Set camera position. */
		setCameraPosition({ x, y, z }) {
			x != undefined && (env.camera.position.x = x)
			y != undefined && (env.camera.position.y = y)
			z != undefined && (env.camera.position.z = z)
			env.camera.lookAt(0, 0, 0)
			env.camera.updateProjectionMatrix()
			env.render()
		},

		/** Set background color. */
		setBackgroundColor(color) {
			env.scene.background = new THREE.Color(color)
			env.render()
		},

		/** Enable trackball controls. */
		enableControls() {
			cameraControls.connectTrackball(env)
		},
	}

	return hc
}
