import { CanvasBoard } from "../../../lib/canvas-board";
import { CanvasHelper } from "../../../lib/canvas-helpers";
import { Delta, Position } from "../../sketch-now/canvas";
import { CursorPosition, MouseAction } from "../../sketch-now/custom-canvas";
import { ElementEnum } from "../../sketch-now/enums";
import { IObjectStyle } from "../../sketch-now/object-styles";
import { BaseObject } from "../base-object";
import { CircleObject, XYHW } from "../types";

export class Circle extends BaseObject {
    object: CircleObject;
    sa = 0;
    ro = 0;
    ea = 2 * Math.PI;
    constructor(id: string, object: CircleObject, board: CanvasBoard, style: IObjectStyle) {
        super(id, object, board, style);
        this.object = object;
    }

    get Value() {
        return this.object.value;
    }

    create(ctx: CanvasRenderingContext2D) {
        this.Board.Helper.applyStyles(ctx, this.style);
        ctx.beginPath();
        const { x: ax, y: ay, h: rY, w: rX } = CanvasHelper.getBoundingArea(this.getValues());
        ctx.ellipse(ax, ay, rX, rY, this.ro, this.sa, this.ea);
        ctx.stroke();
        ctx.fill();
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.create(ctx);
        if (this.IsSelected) {
            this.select({});
        }
        ctx.restore();
    }

    updateValue(ctx: CanvasRenderingContext2D, objectValue: XYHW, action: MouseAction, clearCanvas = true) {
        this.Board.Helper.applyStyles(ctx, this.style);
        let { h, w, x, y } = objectValue;
        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }
        if (h < 0) {
            y = y + h;
            h = Math.abs(h);
        }
        if (w < 0) {
            x = x + w;
            w = Math.abs(w);
        }
        const {
            x: ax,
            y: ay,
            h: rY,
            w: rX
        } = CanvasHelper.getBoundingArea({ type: ElementEnum.Circle, value: { x, y, h, w } });
        ctx.ellipse(ax, ay, rX, rY, this.ro, this.sa, this.ea);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        if (action === "up") {
            this.object.value = { h, w, x, y };
        }
    }

    move(ctx: CanvasRenderingContext2D, position: Position, action: MouseAction, clearCanvas = true) {
        const { x, y } = position;
        this.Board.Helper.applyStyles(ctx, this.style);
        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }
        if (action === "down") {
            this.tmpX = this.object.value.x;
            this.tmpY = this.object.value.y;
        }
        this.IsDragging = true;
        const offsetX = x + this.tmpX;
        const offsetY = y + this.tmpY;
        const {
            x: ax,
            y: ay,
            h: rY,
            w: rX
        } = CanvasHelper.getBoundingArea({
            type: ElementEnum.Circle,
            value: { h: this.Value.h, w: this.Value.w, x: offsetX, y: offsetY }
        });
        ctx.ellipse(ax, ay, rX, rY, this.ro, this.sa, this.ea);
        ctx.stroke();
        ctx.fill();
        this.select({ x: offsetX, y: offsetY });
        this.object.value.x = offsetX;
        this.object.value.y = offsetY;
        if (action === "up") {
            this.tmpX = 0;
            this.tmpY = 0;
            this.IsDragging = false;
        }
    }

    resize(ctx: CanvasRenderingContext2D, delta: Delta, cPos: CursorPosition, action: MouseAction, clearCanvas = true) {
        if (!this.Board.PointerOrigin) {
            return { x: 0, y: 0, w: 0, h: 0 };
        }
        const { dx, dy } = delta;
        this.Board.Helper.applyStyles(ctx, this.style);
        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }

        this.IsDragging = true;
        let w = dx;
        let h = dy;

        if (action === "down") {
            this.tmpX = this.object.value.x;
            this.tmpY = this.object.value.y;
            this.tmpH = this.object.value.h;
            this.tmpW = this.object.value.w;
        }
        let y = this.tmpY;
        let x = this.tmpX;
        switch (cPos) {
            case "tl":
                x = x + w;
                y = y + h;
                if (h < 0) {
                    h = Math.abs(Math.abs(h) + this.tmpH);
                } else {
                    h = Math.abs(this.tmpH - Math.abs(h));
                }
                if (w < 0) {
                    w = Math.abs(Math.abs(w) + this.tmpW);
                } else {
                    w = Math.abs(this.tmpW - Math.abs(w));
                }
                break;
            case "tr":
                y = y + h;
                if (h < 0) {
                    h = Math.abs(this.tmpH + Math.abs(h));
                } else {
                    h = Math.abs(Math.abs(h) - this.tmpH);
                }
                if (w < 0) {
                    w = this.tmpW + w;
                } else {
                    w = Math.abs(this.tmpW + Math.abs(w));
                }
                break;
            case "bl":
                x = x + w;
                if (h < 0) {
                    h = this.tmpH - Math.abs(h);
                } else {
                    h = Math.abs(Math.abs(h) + this.tmpH);
                }
                if (w < 0) {
                    w = Math.abs(this.tmpW + Math.abs(w));
                } else {
                    w = Math.abs(this.tmpW - Math.abs(w));
                }
                break;
            case "br":
                if (h < 0) {
                    h = h + this.tmpH;
                } else {
                    h = Math.abs(this.tmpH + Math.abs(h));
                }
                if (w < 0) {
                    w = this.tmpW + w;
                } else {
                    w = Math.abs(this.tmpW + Math.abs(w));
                }
                break;
            case "t":
                break;
            case "b":
                break;
            case "l":
                break;
            case "r":
                break;
        }
        if (x >= this.tmpX + this.tmpW) {
            x = this.tmpX + this.tmpW;
        }
        if (y >= this.tmpY + this.tmpH) {
            y = this.tmpY + this.tmpH;
        }
        if (h < 0) {
            y = y + h;
            h = Math.abs(h);
        }
        if (w < 0) {
            x = x + w;
            w = Math.abs(w);
        }
        const {
            x: ax,
            y: ay,
            h: rY,
            w: rX
        } = CanvasHelper.getBoundingArea({ type: ElementEnum.Circle, value: { x, y, h, w } });

        ctx.ellipse(ax, ay, rX, rY, this.ro, this.sa, this.ea);
        ctx.stroke();
        ctx.restore();

        this.select({ h, w, x, y });
        this.object.value.h = h;
        this.object.value.w = w;
        this.object.value.x = x;
        this.object.value.y = y;
        if (action === "up") {
            this.tmpX = 0;
            this.tmpY = 0;
            this.tmpH = 0;
            this.tmpW = 0;
            this.IsDragging = false;
        }
        return { x, y, h, w };
    }

    updateStyle<T extends keyof IObjectStyle>(ctx: CanvasRenderingContext2D, key: T, value: IObjectStyle[T]) {
        this.style[key] = value;
        this.Board.Helper.applyStyles(ctx, this.style);
        this.Board.Helper.clearCanvasArea(ctx);
        ctx.beginPath();
        const { x: ax, y: ay, h: rY, w: rX } = CanvasHelper.getBoundingArea(this.getValues());
        ctx.ellipse(ax, ay, rX, rY, this.ro, this.sa, this.ea);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
        this.select({});
    }

    getValues(): CircleObject {
        return this.object;
    }
}
