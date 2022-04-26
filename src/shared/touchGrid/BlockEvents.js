import { Events } from './Events'

export class BlockEnterEvents extends Events {
    constructor() {
        super()
        this._entered = undefined
    }

    _setEntered(block, silent = false) {
        if (arraysEqual(block, this._entered)) return
        const previousBlock = this._entered
        this._entered = block
        if (silent === true) return
        if (block === undefined || previousBlock !== undefined) this._blockLeft(previousBlock)
		if (block !== undefined) this._blockEntered(block)
    }

    touchStart(block) {
        if (block[0] === 'out' || block[0] === 'border') {
			this._setEntered(undefined)
            return
        }
        this._setEntered(block[1], true)
        this._firstBlockEntered(block[1])
    }

    touchMove(block) {
        if (block[0] === 'out' || block[0] === 'border') { 
            this._setEntered(undefined)
            return
        }
        this._setEntered(block[1])
    }

    touchEnd(block) {
        this._setEntered(undefined)
        if (block[0] === 'block') this._blockReleased(block[1])
        else this._gestureInterrupted()
    }

    interrupt() { /* ... */ }

    /* Dispatching events */
    _firstBlockEntered(block) { this.publish('enterFirstBlock', { block: block }); }
    _blockEntered(block) { this.publish('enterBlock', { block: block }); }
    _blockLeft(block) { this.publish('leaveBlock', { block: block }); }
    _blockReleased(block) { this.publish('release', { block: block }); }
    _gestureInterrupted() { this.publish('releaseOut'); }
}

export function arraysEqual(a, b) {
    if (a === undefined && b === undefined) return true
    if (a === undefined || b === undefined) return false
    let i = a.length
    if (i != b.length) return false
    while (i--) 
		if (a[i] !== b[i]) return false
    return true
};


export class BlockPath extends Events {
    constructor() {
        super()
        this.path = { 
            from: undefined,
            to: undefined
        }
    }

    reset() {
        this.path = { 
            from: undefined,
            to: undefined
        } 
    }

    _setFrom(from) {
        const oldBlock = this.path.from
        this.path.from = from
        this.publish('setStartBlock', { block: from, oldBlock: oldBlock })
    }

    _setTo(to) {
        const oldBlock = this.path.to
        this.path.to = to
        this.publish('setEndBlock', { block: to, oldBlock: oldBlock })
    }

    blockEntered(block) {
        if (this.path.from === undefined) { this._setFrom(block) }
        else { 
            if (arraysEqual(this.path.from, block)) { this._setTo(undefined) }
            else { this._setTo(block) }
        }
    }

    blockLeft(block) {
        if (!arraysEqual(this.path.to, block)) return
        this._setTo(undefined)
    }
}
