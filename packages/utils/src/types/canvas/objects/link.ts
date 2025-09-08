import { BaseObject } from "../base-object";
import { LinkObject, LinkValue } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";
import { IObjectStyle } from "../../sketch-now/object-styles";
import { MouseAction } from "../../sketch-now/custom-canvas";

export class Link extends BaseObject {
    object: LinkObject;
    constructor(id: string, object: LinkObject, board: CanvasBoard, style: IObjectStyle) {
        super(id, object, board, style);
        this.object = object;
    }

    create(ctx: CanvasRenderingContext2D) {
        this.draw(ctx);
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.Value.start || !this.Value.end) {
            return;
        }
        const { x: sx, y: sy } = this.Value.start.value;
        const { x: ex, y: ey } = this.Value.end.value;
        this.Board.Helper.applyStyles(ctx, this.style);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    get Value() {
        return this.object.value;
    }

    getValues(): LinkObject {
        return this.object;
    }

    updateValue(ctx: CanvasRenderingContext2D, objectValue: LinkValue, action: MouseAction, clearCanvas = true) {
        const { end, start } = objectValue;
        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }
        console.log(end);
        this.Value.start = start;
        this.Value.end = end;
        this.draw(ctx);
    }
}
