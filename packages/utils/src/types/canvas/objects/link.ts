import { BaseObject } from "../base-object";
import { LinkObject, LinkValue } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";
import { IObjectStyle } from "../../sketch-now/object-styles";
import { MouseAction } from "../../sketch-now/custom-canvas";
import { Position } from "../../sketch-now/canvas";

export class Link extends BaseObject {
    private tmpEX = 0;
    private tmpEY = 0;
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
        const { x: sx, y: sy } = this.Value.start;
        const asx = sx;
        const asy = sy;
        const { x: ex, y: ey } = this.Value.end;
        const aex = ex;
        const aey = ey;
        this.Board.Helper.applyStyles(ctx, this.style);
        ctx.beginPath();
        ctx.moveTo(asx, asy);
        ctx.lineTo(aex, aey);
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

    move(ctx: CanvasRenderingContext2D, position: Position, action: MouseAction, clearCanvas?: boolean): void {
        if (!this.Value.start || !this.Value.end) {
            return;
        }
        this.IsDragging = true;
        const { x, y } = position;
        if (action === "down") {
            this.tmpX = this.Value.start.x;
            this.tmpY = this.Value.start.y;
            this.tmpEX = this.Value.end.x;
            this.tmpEY = this.Value.end.y;
        }
        this.Board.Helper.applyStyles(ctx, this.style);
        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }
        const isStartingTargetMoving = this.Board.ActiveObjects.find((o) => o.id == this.Value.start?.id) != null;
        const isEndingTargetMoving = this.Board.ActiveObjects.find((o) => o.id == this.Value.end?.id) != null;
        const offsetX = x + this.tmpX;
        const offsetY = y + this.tmpY;
        const offsetEX = x + this.tmpEX;
        const offsetEY = y + this.tmpEY;
        if (isStartingTargetMoving && isEndingTargetMoving) {
            this.updateValue(
                ctx,
                {
                    start: {
                        id: this.Value.start.id,
                        x: offsetX,
                        y: offsetY
                    },
                    end: {
                        id: this.Value.end.id,
                        x: offsetEX,
                        y: offsetEY
                    }
                },
                action,
                clearCanvas
            );
        } else if (isStartingTargetMoving) {
            this.updateValue(
                ctx,
                {
                    ...this.Value,
                    start: {
                        id: this.Value.start.id,
                        x: offsetX,
                        y: offsetY
                    }
                },
                action,
                clearCanvas
            );
        } else {
            this.updateValue(
                ctx,
                {
                    ...this.Value,
                    end: {
                        id: this.Value.end.id,
                        x: offsetEX,
                        y: offsetEY
                    }
                },
                action,
                clearCanvas
            );
        }
        if (action === "up") {
            this.tmpX = 0;
            this.tmpY = 0;
            this.tmpEX = 0;
            this.tmpEY = 0;
            this.IsDragging = false;
        }
    }

    updateValue(ctx: CanvasRenderingContext2D, objectValue: LinkValue, action: MouseAction, clearCanvas = true) {
        const { end, start } = objectValue;
        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }
        this.Value.start = start;
        this.Value.end = end;
        this.draw(ctx);
    }

    shouldUpdate(elementId: string) {
        return this.Value.start?.id == elementId || this.Value.end?.id == elementId;
    }
}
