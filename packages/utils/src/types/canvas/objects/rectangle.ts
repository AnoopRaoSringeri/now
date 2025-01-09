import { BaseObject } from "../base-object";
import { RectangleObject } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";

export class Rectangle extends BaseObject {
    object: RectangleObject;
    constructor(id: string, object: RectangleObject, board: CanvasBoard) {
        super(id, object, board);
        this.object = object;
    }

    get Value() {
        return this.object.value;
    }

    create(ctx: CanvasRenderingContext2D) {
        const { x, y, w, h } = this.Value;
        this.Board.Helper.applyStyles(ctx, this.style);
        ctx.strokeRect(x, y, w, h);
        ctx.fillRect(x, y, w, h);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.create(ctx);
        if (this.IsSelected) {
            this.select({});
        }
        ctx.restore();
    }

    getValues(): RectangleObject {
        return this.object;
    }
}
