import { hyperCube } from '@hyper/hypercube'
import * as keyboard from './keyboard'

const container = document.getElementById('container')
const w = container.offsetWidth
const h = container.offsetHeight

;(async () => {
    const hypercube = await hyperCube({ w, h })
    container.appendChild(hypercube.canvas)
    hypercube.enableControls()
    window.addEventListener('resize', () => hypercube.setSize(container.offsetWidth, container.offsetHeight))
    container.focus()
    keyboard.connect(hypercube, $(document))
})()
