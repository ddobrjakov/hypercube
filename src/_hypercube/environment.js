import * as THREE from 'three'

/** Create 3D environment using THREE (renderer, camera, scene). */
export default function createEnvironment(w, h, cameraPosition, backgroundColor) {

    const createRenderer = (w, h) => {
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(w, h)
		renderer.setPixelRatio(window.devicePixelRatio)
        return renderer
    }
    
    const createCamera = (w, h) => {
        const camera = new THREE.PerspectiveCamera(45, w / h, 1, 100)
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
        camera.lookAt(new THREE.Vector3(0, 0, 0))
        return camera
    }
    
    const createScene = () => {

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(backgroundColor) /*0x091921*/
    
        const COLOR = 0xFFFFFF
        const INTENSITY = 1
        const DISTANCE = 10

        const light1 = new THREE.DirectionalLight(COLOR, INTENSITY)
        light1.position.set(0, 0, DISTANCE)
    
        const light2 = new THREE.DirectionalLight(COLOR, INTENSITY)
        light2.position.set(0, 0, -DISTANCE)

        const light3 = new THREE.DirectionalLight(COLOR, INTENSITY)
        light3.position.set(0, DISTANCE, 0)

        const light4 = new THREE.DirectionalLight(COLOR, INTENSITY)
        light4.position.set(0, -DISTANCE, 0)

        const light5 = new THREE.DirectionalLight(COLOR, INTENSITY)
        light5.position.set(DISTANCE, 0, 0)

        const light6 = new THREE.DirectionalLight(COLOR, INTENSITY)
        light6.position.set(-DISTANCE, 0, 0)

        scene.add(light1, light2, light3, light4, light5, light6)
    
        return scene

    }

    const renderer = createRenderer(w, h)
    const camera = createCamera(w, h)
    const scene = createScene()
    scene.add(camera)

    return { 
        renderer, camera, scene,
        render: () => renderer.render(scene, camera),
		resize: function(w, h) {
			renderer.setSize(w, h)
			camera.aspect = w / h
			camera.updateProjectionMatrix()
			this.render()
		}
    }

}
