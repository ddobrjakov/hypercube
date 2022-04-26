import { BlockPositioning } from './BlockPositioning'
import { Events } from './Events'
import { BlockEnterEvents, BlockPath, arraysEqual } from './BlockEvents'
import { BoardView } from './BoardView'

export class TouchControl extends Events {
    constructor(canvas, ctx) {
        super();
        this.canvas = canvas;
        this.ctx = ctx;
        this.blocks = new BlockPositioning(this.canvas.width, this.canvas.height);
        this.boardView = new BoardView(canvas, ctx, this.blocks);
        this.enterEvents = new BlockEnterEvents();
        this.enterEvents.subscribe('enterFirstBlock', this.onFirstBlockEntered.bind(this));
        this.enterEvents.subscribe('enterBlock', this.onBlockEntered.bind(this));
        this.enterEvents.subscribe('leaveBlock', this.onBlockLeft.bind(this));
        this.enterEvents.subscribe('release', this.onBlockReleased.bind(this));
        this.enterEvents.subscribe('releaseOut', this.onReleasedOut.bind(this));
        this.blockPath = new BlockPath();
        this.blockPath.subscribe('setStartBlock', this.onSetStart.bind(this));
        this.blockPath.subscribe('setEndBlock', this.onSetEnd.bind(this));
    }

    click(clickEvent) { }

    touchStart(touchEvent) {
        this.enterEvents.touchStart(this._getTouchBlock(touchEvent.touches[0]));
    }

    touchMove(touchEvent) { 
        this.enterEvents.touchMove(this._getTouchBlock(touchEvent.touches[0]));
    }

    touchEnd(touchEvent) { 
        this.enterEvents.touchEnd(this._getTouchBlock(touchEvent.changedTouches[0]));
    }

    _checkPath() {
		this.publish('enter', this.blockPath.path)
        this.blockPath.reset();
    }

    _getTouchBlock(touch) {
        return this.blocks._xy_block(this._getTouchPos(touch));
    }

    _getTouchPos(touch) {
        const rect = this.canvas.getBoundingClientRect();
        return {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        };
    }

    drawBoard() {
		this.blocks = new BlockPositioning(this.canvas.width, this.canvas.height);
        this.boardView = new BoardView(this.canvas, this.ctx, this.blocks);
        this.boardView.drawBoard();
    }

    /* Events handling */

    onFirstBlockEntered(data) {
        this.blockPath.blockEntered(data.block);
    }

    onBlockEntered(data) {
        this.blockPath.blockEntered(data.block);
    }

    onBlockLeft(data) {
        if (!arraysEqual(data.block, this.blockPath.path.from)) {
            this.boardView.styleBlock_Default(data.block);
        }
        this.blockPath.blockLeft(data.block);
    }

    onBlockReleased(data) {
        this.blockPath.blockEntered(data.block);

        if (this.blockPath.path.from != undefined) {
            this.boardView.styleBlock_Default(this.blockPath.path.from);
        }
        if (this.blockPath.path.to != undefined) {
            this.boardView.styleBlock_Default(this.blockPath.path.to);
        }
        this._checkPath();
    }

    onReleasedOut(data) {
        if (this.blockPath.path.from != undefined) {
            this.boardView.styleBlock_Default(this.blockPath.path.from);
        }
        if (this.blockPath.path.to != undefined) {
            this.boardView.styleBlock_Default(this.blockPath.path.to);
        }
        this.blockPath.reset();
    }

    /* Path events */

    onSetStart(data) {
        if (data.oldBlock != undefined) {
            this.boardView.styleBlock_Default(data.oldBlock);
        }
        if (data.block != undefined) {
            this.boardView.styleBlock_PathStart(data.block);
        }
    }

    onSetEnd(data) {
        if (data.oldBlock != undefined) {
            this.boardView.styleBlock_Default(data.oldBlock);
        }
        if (data.block != undefined) {
            this.boardView.styleBlock_PathEnd(data.block);
        }
    }
}

export function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}
