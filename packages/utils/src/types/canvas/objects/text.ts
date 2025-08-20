import { BaseObject } from "../base-object";
import { TextObject, TextValue } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";
import { MouseAction } from "../../sketch-now/custom-canvas";
import { IObjectStyle } from "../../sketch-now/object-styles";

export class Text extends BaseObject {
    object: TextObject;
    constructor(id: string, object: TextObject, board: CanvasBoard, style: IObjectStyle) {
        super(id, object, board, style);
        this.object = object;
    }

    create(ctx: CanvasRenderingContext2D) {
        this.draw(ctx);
    }

    draw(ctx: CanvasRenderingContext2D) {
        const { x, y } = this.Cords;
        this.Board.Helper.applyStyles(ctx, this.style);
        const texts = this.Value.value.split("\n");
        let width = 0;
        texts.forEach((text, i) => {
            ctx.fillText(text, x, y + i * Number(this.style.font?.size ?? 1));
            width = Math.max(width, ctx.measureText(text).width);
        });
        const metrics = ctx.measureText(this.Value.value);
        this.Value.w = width;
        this.Value.h = (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent) * texts.length;
        if (this.IsSelected) {
            this.select(this.Value);
        }
        ctx.restore();
    }

    updateValue(ctx: CanvasRenderingContext2D, objectValue: TextValue, action: MouseAction, clearCanvas = true) {
        const { value } = objectValue;
        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }
        this.Value.value = value;
        this.draw(ctx);
    }

    get Value() {
        return this.object.value;
    }

    getValues(): TextObject {
        return this.object;
    }
}
