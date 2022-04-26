export function events() {
    const subscribers = { }
    return {
		onEvent(event, handle) {
			if (!subscribers[event]) { subscribers[event] = [] }
			subscribers[event].push(handle)
		},
		raise(event, data) {
			if (!subscribers[event]) { return }
			subscribers[event].forEach(handle => handle(data))
		}
    }
}
