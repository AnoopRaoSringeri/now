import { BaseObject } from "../base-object";
import { SquareObject } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";

export class Square extends BaseObject {
    object: SquareObject;
    constructor(id: string, object: SquareObject, board: CanvasBoard) {
        super(id, object, board);
        this.object = object;
    }

    get Value() {
        return this.object.value;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.create(ctx);
        if (this.IsSelected) {
            this.select({});
        }
        ctx.restore();
    }

    create(ctx: CanvasRenderingContext2D) {
        const { x, y, h } = this.Value;
        this.Board.Helper.applyStyles(ctx, this.style);
        ctx.strokeRect(x, y, h, h);
        ctx.fillRect(x, y, h, h);
    }

    getValues(): SquareObject {
        return this.object;
    }
}
