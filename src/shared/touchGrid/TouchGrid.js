import { TouchControl } from './TouchControl'
import { registerCanvasEvents } from './canvasEvents'
import { Events } from './Events'

export function touchGrid({ w, h }) {
	const canvas = document.createElement('canvas');
	canvas.width = w; canvas.height = h;
	const ctx = canvas.getContext('2d');
	const control = new TouchControl(canvas, ctx);
	const redraw = () => { control.drawBoard() };
	registerCanvasEvents(control, canvas);
	redraw();
	const e = new Events();
	control.subscribe('enter', path => e.publish('enter', path));
	return {
		canvas: () => canvas,
		redraw,
		setSize: (w, h) => { canvas.width = w; canvas.height = h; redraw() },
		subscribe: e.subscribe.bind(e)
	}
}
