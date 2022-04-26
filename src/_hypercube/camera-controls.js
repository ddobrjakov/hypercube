import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { TrackballControls } from "./lib/TrackballControls"

export function connectOrbit(environment) {
    const controls = new OrbitControls(environment.camera, environment.renderer.domElement)
    controls.minDistance = 6.0
    controls.maxDistance = 40.0
    controls.maxPolarAngle = Infinity
    controls.maxAzimuthAngle = Infinity
    controls.addEventListener('change', environment.render)
    return controls
}

export function connectTrackball(environment) {
    const controls = new TrackballControls(environment.camera, environment.renderer.domElement)
    controls.minDistance = 6.0
    controls.maxDistance = 40.0
    controls.enabled = true
    controls.rotateSpeed = 3
    controls.addEventListener('change', environment.render)
    return controls
}
