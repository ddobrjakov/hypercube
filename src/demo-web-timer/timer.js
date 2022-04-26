/* UI timer element */
export function timerDisplay(output) {

    const timer = makeTimer()

    function start() {
        reset()
        timer.start()
        animate()
    }

    function stop() {
        timer.stop()
        display(timer.loopTime)
    }

    function reset() {
        penalty = 'none'
        display(0)
    }

    var penalty = 'none'
    function setPenalty($penalty) {
        if (timer.running) { return }
        penalty = $penalty
    }

    function timeString(time, penalty) {
        if (penalty === 'DNF') return `DNF(${pretty(time)})`
        if (penalty === '+2') return `${pretty(time+2000)}+`
        return pretty(time)
    }

    function display(time) {
        output.html(timeString(time, penalty))
    }

    function animate() {
        if (!timer.running) return

        display(timer.time())
        requestAnimationFrame(animate)
    }

    const getTime = () => ({
        time: timer.loopTime,
        penalty,
        get formatted() { return timeString(this.time, this.penalty) }
    })

    return { 
        start, stop, reset, setPenalty,
        get time() { return getTime() }
    }

}

/* Thanks to qqtimer */
export function pretty(time, useMilli = false) {
    if (time < 0) return "DNF"
    time = Math.round(time / (useMilli ? 1 : 10))
    var bits = time % (useMilli ? 1000 : 100)
    time = (time - bits) / (useMilli ? 1000 : 100)
    var secs = time % 60
    var mins = ((time - secs) / 60) % 60
    var hours = (time - secs - 60 * mins) / 3600
    var s = "" + bits
    if (bits < 10) { s = "0" + s }
    if (bits < 100 && useMilli) { s = "0" + s }
    s = secs + "." + s
    if (secs < 10 && (mins > 0 || hours > 0)) { s = "0" + s }
    if (mins > 0 || hours > 0) { s = mins + ":" + s }
    if (mins < 10 && hours > 0) { s = "0" + s }
    if (hours > 0) { s = hours + ":" + s }
    return s
}

/* Simple timer with loops */
function makeTimer() {
    let loops = [ ]
    let timeStart, timeEnd
    let running = false
    return {
		start() { 
			loops = []
			running = true
			timeStart = new Date()
		}, 
        loop() { 
			if (!running) return 0
			timeEnd = new Date()
			const _loopTime = this.loopTime
			loops.push(_loopTime)
			return _loopTime
		}, 
        stop() {
			if (!running) return 0
			const time = this.loop()
			running = false
			return time
		}, 
        time() {
			if (!timeStart) return 0
			return (new Date()) - timeStart
		},
        get running() { return running },
		get loopTime() { 
			if (!timeStart || !timeEnd) return 0
			return timeEnd - timeStart 
		},
        get loops() { return [...loops] }
    }
}
