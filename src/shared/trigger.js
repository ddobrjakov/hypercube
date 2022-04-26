/**
 * Manage different handlers for different keys.
 * @param {Function} setup Function that takes general handler as an argument and sets up whenever it should be executed.
 */
export function createTrigger(setup) {
    const keyGroups = [ ]
	const use = (keyMap, handler) => keyGroups.push({ keyMap, handler })
	const useKey = (key, handler) => keyGroups.push({ keyMap: { [key]: { 'key': key }}, handler })
	const trigger = (key, data) => { 
		if (key === undefined) return { success: true }
        for (const { keyMap, handler } of keyGroups) {
            const value = keyMap[key]
            if (value) return { success: true, value: handler(value, data) }
        }
        return { success: false }
    }
	setup(trigger)
    return { use, useKey, trigger }
}
