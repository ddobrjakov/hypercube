import { hyperCube } from '@hyper/hypercube'
import { touchGrid } from '@hyper/shared'
import { connectKeyboard } from './keyboard'
import { connectTouch } from './touch'

const container = document.getElementById('container')
const w = container.offsetWidth
const h = container.offsetHeight;

(async () => {
	const grid = touchGrid({ w, h })
	container.appendChild(grid.canvas())
	grid.canvas().style.zIndex = 1
	grid.canvas().style.position = 'absolute'
	grid.canvas().style.touchAction = 'none'

	const cube = await hyperCube({ w, h })
	container.appendChild(cube.canvas)
	cube.moveCamera({ x: 4.5, y: 4.5, z: 4.5 })
	cube.enableControls()

	window.addEventListener('resize', () => {
		cube.setSize(container.offsetWidth, container.offsetHeight)
		grid.setSize(container.offsetWidth, container.offsetHeight)
	})

	container.focus()
	connectKeyboard(cube, $(document))
	connectTouch(cube, grid)
})()
