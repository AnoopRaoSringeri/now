import { BaseObject } from "../base-object";
import { LineObject, LinePoints } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";
import { MouseAction } from "../../sketch-now/custom-canvas";

export class Line extends BaseObject {
    object: LineObject;
    constructor(id: string, object: LineObject, board: CanvasBoard) {
        super(id, object, board);
        this.object = object;
    }

    get Value() {
        return this.object.value;
    }

    create(ctx: CanvasRenderingContext2D) {
        this.Board.Helper.applyStyles(ctx, this.style);
        ctx.beginPath();
        ctx.moveTo(this.Value.sx, this.Value.sy);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.Board.Helper.applyStyles(ctx, this.style);
        ctx.beginPath();
        ctx.moveTo(this.Value.sx, this.Value.sy);
        ctx.lineTo(this.Value.ex, this.Value.ey);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    updateValue(ctx: CanvasRenderingContext2D, objectValue: LinePoints, action: MouseAction, clearCanvas = true) {
        const { sx, sy, ex, ey } = objectValue;
        if (action === "down") {
            this.Board.Helper.applyStyles(ctx, this.style);
        }
        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        this.Value.sx = sx;
        this.Value.sy = sy;
        this.Value.ex = ex;
        this.Value.ey = ey;
    }

    getValues(): LineObject {
        return this.object;
    }
}
