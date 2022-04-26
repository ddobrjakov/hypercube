export class BoardView {
    constructor(canvas, ctx, blocks) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.blocks = blocks;

        /* CONSTANTS */
        this.BACKGROUND_COLOR = 'rgba(255, 255, 255, 0.05)';
        this.START_PATH_COLOR = 'rgba(0, 255, 0, 0.20)';
        this.END_PATH_COLOR = 'rgba(0, 255, 255, 0.20)';
        this.BORDER_COLOR = 'rgba(255, 255, 255, 0.5)';
        this.LINE_WIDTH = 1;
    }

    drawBoard() {
        this.ctx.fillStyle = this.BACKGROUND_COLOR;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = this.BORDER_COLOR;
        this.ctx.lineWidth = this.LINE_WIDTH;

        for (const x of this.blocks._verticalLines()) {
            this.ctx.moveTo(x, -1);
            this.ctx.lineTo(x, this.canvas.height);
        }

        for (const y of this.blocks._horizontalLines()) {
            this.ctx.moveTo(-1, y);
            this.ctx.lineTo(this.canvas.width, y);
        }

        this.ctx.stroke();
    }
    
    fillBlock(block, style) {
        const rect = this.blocks._get_rect(block[0], block[1]);
        this.ctx.fillStyle = style;
        this.ctx.clearRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
        this.ctx.fillRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
    }

    styleBlock_PathStart(block) {
        this.fillBlock(block, this.START_PATH_COLOR);
    }

    styleBlock_PathEnd(block) {
        this.fillBlock(block, this.END_PATH_COLOR);
    }

    styleBlock_Default(block) {
        this.fillBlock(block, this.BACKGROUND_COLOR);
    }
}
