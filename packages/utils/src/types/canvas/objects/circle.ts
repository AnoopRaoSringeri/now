import { BaseObject } from "../base-object";
import { CircleObject, XYHW } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";
import { CanvasHelper } from "../../../lib/canvas-helpers";
import { CursorPosition, MouseAction } from "../../sketch-now/custom-canvas";
import { IObjectStyle } from "../../sketch-now/object-styles";
import { Delta, Position } from "../../sketch-now/canvas";
import { ElementEnum } from "../../sketch-now/enums";

export class Circle extends BaseObject {
    object: CircleObject;
    sa = 0;
    ro = 0;
    ea = 2 * Math.PI;
    constructor(id: string, object: CircleObject, board: CanvasBoard) {
        super(id, object, board);
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
        ctx.beginPath();
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
        console.log({ x, y, h, w }, { ax, ay, rX, rY });
        ctx.ellipse(ax, ay, rX, rY, this.ro, this.sa, this.ea);
        // ctx.ellipse(x, y, w, h, this.ro, this.sa, this.ea);
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
        this.IsDragging = true;
        const offsetX = x + this.Value.x;
        const offsetY = y + this.Value.y;
        ctx.beginPath();
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
        if (action === "up") {
            ctx.closePath();
            ctx.restore();
            this.Value.x = offsetX;
            this.Value.y = offsetY;
            this.IsDragging = false;
        }
    }

    resize(ctx: CanvasRenderingContext2D, delta: Delta, cPos: CursorPosition, action: MouseAction, clearCanvas = true) {
        const { dx, dy } = delta;
        this.Board.Helper.applyStyles(ctx, this.style);

        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }
        let w = dx;
        let h = dy;
        let y = this.Value.y;
        let x = this.Value.x;
        switch (cPos) {
            case "tl":
                x = x + w;
                y = y + h;
                if (h < 0) {
                    h = Math.abs(Math.abs(h) + this.Value.h);
                } else {
                    h = Math.abs(this.Value.h - Math.abs(h));
                }
                if (w < 0) {
                    w = Math.abs(Math.abs(w) + this.Value.w);
                } else {
                    w = Math.abs(this.Value.w - Math.abs(w));
                }
                break;
            case "tr":
                y = y + h;
                if (h < 0) {
                    h = Math.abs(this.Value.h + Math.abs(h));
                } else {
                    h = Math.abs(Math.abs(h) - this.Value.h);
                }
                if (w < 0) {
                    w = this.Value.w + w;
                } else {
                    w = Math.abs(this.Value.w + Math.abs(w));
                }
                break;
            case "bl":
                x = x + w;
                if (h < 0) {
                    h = this.Value.h - Math.abs(h);
                } else {
                    h = Math.abs(Math.abs(h) + this.Value.h);
                }
                if (w < 0) {
                    w = Math.abs(this.Value.w + Math.abs(w));
                } else {
                    w = Math.abs(this.Value.w - Math.abs(w));
                }
                break;
            case "br":
                if (h < 0) {
                    h = h + this.Value.h;
                } else {
                    h = Math.abs(this.Value.h + Math.abs(h));
                }
                if (w < 0) {
                    w = this.Value.w + w;
                } else {
                    w = Math.abs(this.Value.w + Math.abs(w));
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
        if (x >= this.Value.x + this.Value.w) {
            x = this.Value.x + this.Value.w;
        }
        if (y >= this.Value.y + this.Value.h) {
            y = this.Value.y + this.Value.h;
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
        ctx.beginPath();
        ctx.ellipse(ax, ay, rX, rY, this.ro, this.sa, this.ea);
        ctx.stroke();
        ctx.restore();

        this.select({ h, w, x, y });
        if (action === "up") {
            this.Value.h = h;
            this.Value.w = w;
            this.Value.x = x;
            this.Value.y = y;
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
    }

    getValues(): CircleObject {
        return this.object;
    }
}
