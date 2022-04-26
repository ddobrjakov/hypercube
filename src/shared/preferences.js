var DEFAULT_PREFERENCES = { }

export function setDefault(def) {
	DEFAULT_PREFERENCES = def
} 

export function getDefault() {
	return DEFAULT_PREFERENCES
}

var CACHED_USER_PREFERENCES = { }

function censor(_key, value) {
    return value === Infinity ? "Infinity" : value
}

function uncensor(_key, value) {
    return value === "Infinity" ? Infinity : value;
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value, censor))
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key)
    return value && JSON.parse(value, uncensor)
}

function copy(pref) { return JSON.parse(JSON.stringify(pref)) }
function withWarning(res, ...warning) { console.warn(...warning); return res }

var _cached = false
function getUserPreferences() {
    if (!_cached) { CACHED_USER_PREFERENCES = fetchPreferences(DEFAULT_PREFERENCES); _cached = true }
    return CACHED_USER_PREFERENCES

    function fetchPreferences(fallbackPreferences) {
        if (!localStorage) return withWarning(copy(fallbackPreferences))
        const fetched = localStorage.getObject('preferences')
        if (!fetched && !pushPreferences(fallbackPreferences))
            return withWarning(copy(fallbackPreferences))
        return fetched ?? copy(fallbackPreferences)
    }
}

function pushPreferences(pref) {
    try { localStorage.setObject('preferences', pref); return true }
    catch (e) { return withWarning(false, "Error: preferences cannot be saved to localStorage.", e) }
}

export function update(pref) {
    pushPreferences(pref)
    _cached = false
    getUserPreferences()
}

export function get() {
    return getUserPreferences()
}

/* Change individual settings */

function _get(key) { return getUserPreferences()[key] }

function _set(key, value) {
    getUserPreferences()[key] = value
    pushPreferences(CACHED_USER_PREFERENCES)
    console.log(`user preference is changed: (${key}:${value})`)
}

/* Push default settings if localStorage is empty */
// getUserPreferences()
