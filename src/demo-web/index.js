import { hyperCube } from '@hyper/hypercube'
import { connectKeyboard } from './keyboard'
import { setupSettings } from './settings'

const container = document.getElementById('container')
const [ w, h ] = [ container.offsetWidth, container.offsetHeight ]

;(async () => {
	const hypercube = await hyperCube({ w, h }, { })
	container.appendChild(hypercube.canvas)
	hypercube.enableControls()
	window.addEventListener('resize', () => hypercube.setSize(container.offsetWidth, container.offsetHeight))
	container.focus()
	connectKeyboard(hypercube, container)
	setupSettings(hypercube, container)
})()
