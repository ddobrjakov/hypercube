import { range } from './TouchControl'

/** Positioning of blocks */
export class BlockPositioning {
    constructor(canvas_width, canvas_height) {
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;
    }

    /** y-coordinates of horizontal lines making a grid */
    _horizontalLines() {
        const block_height = (this.canvas_height - 1) / 3;
        return range(4, 0).map(j => 0.5 + ((j * block_height) | 0));
    }

    /** x-coordinates of vertical lines making a grid */
    _verticalLines() {
        const block_width = (this.canvas_width - 1) / 3;
        return range(4, 0).map(i => 0.5 + ((i * block_width) | 0));
    }

    /** x-index of block at position */
    _x_block(position) {
        const x = position.x;
        const lines = this._verticalLines();
        for (let index = 0; index < lines.length; index++) {
            let border = lines[index];
            let lower_bound = Math.floor(border);
            if (Math.floor(x) === lower_bound) { return ['border', [index - 1, index]] }
            if (x < lower_bound) { return [(index > 0) ? 'block' : 'out', index - 1] }
        }
        return ['out', [lines.length + 1]];
    }

    /** y-index of block at position */
    _y_block(position) {
        const y = position.y;
        const lines = this._horizontalLines();
        for (let index = 0; index < lines.length; index++) {
            let border = lines[index];
            let lower_bound = Math.floor(border);
            if (Math.floor(y) === lower_bound) { return ['border', [index - 1, index]] }
            if (y < lower_bound) { return [(index > 0) ? 'block' : 'out', index - 1] }
        }
        return ['out', [lines.length + 1]];
    }

    /** x,y-indexes of block at position */
    _xy_block(position) {
        const x_block = this._x_block(position);
        const y_block = this._y_block(position);

        if (x_block[0] === 'out' || y_block[0] === 'out') { return ['out'] }

        if (x_block[0] === 'border' && y_block[0] === 'border') {
            return ['border', [
                [x_block[1][0], y_block[1][0]],
                [x_block[1][1], y_block[1][0]],
                [x_block[1][0], y_block[1][1]],
                [x_block[1][1], y_block[1][1]]
            ]];
        }

        if (x_block[0] === 'border') { 
            return ['border', [
                [x_block[1][0], y_block[1]],
                [x_block[1][1], y_block[1]]
            ]];
        }

        if (y_block[0] === 'border') { 
            return ['border', [
                [x_block[1], y_block[1][0]],
                [x_block[1], y_block[1][1]]
            ]];
        }

        return ['block', [x_block[1], y_block[1]]];
    }

    /** position rectangle of block */
    _get_rect(i, j) {
        return {
            left: this._verticalLines()[i] + 0.5,
            top: this._horizontalLines()[j] + 0.5,
            right: this._verticalLines()[i + 1] - 0.5,
            bottom: this._horizontalLines()[j + 1] - 0.5,
        }
    }
}
