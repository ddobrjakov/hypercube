export function registerCanvasEvents(control, canvas) {
    canvas.ontouchstart = function(e) {
        control.touchStart(e);
    }

    canvas.ontouchmove = function(e) {
        control.touchMove(e);
    }

    canvas.ontouchend = function(e) {
        control.touchEnd(e);
    }
}
