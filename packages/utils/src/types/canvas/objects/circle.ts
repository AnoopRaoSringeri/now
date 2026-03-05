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

    /**
     * Centralized render method to handle Style State management
     * This ensures ctx.restore() is called to balance applyStyles' ctx.save()
     */
    private render(ctx: CanvasRenderingContext2D, values: XYHW, clearCanvas: boolean) {
        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }

        // 1. applyStyles calls ctx.save()
        this.Board.Helper.applyStyles(ctx, this.style);

        const { x, y, h, w } = values;
        const {
            x: ax,
            y: ay,
            h: rY,
            w: rX
        } = CanvasHelper.getBoundingArea({
            type: ElementEnum.Circle,
            value: { x, y, h, w }
        });

        ctx.beginPath();
        ctx.ellipse(ax, ay, rX, rY, this.ro, this.sa, this.ea);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // 2. Restore to prevent style/transform leakage
        ctx.restore();
    }

    create(ctx: CanvasRenderingContext2D) {
        this.render(ctx, this.Value, false);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.create(ctx);
        if (this.IsSelected) {
            this.select({});
        }
    }

    updateValue(ctx: CanvasRenderingContext2D, objectValue: XYHW, action: MouseAction, clearCanvas = true) {
        let { h, w, x, y } = objectValue;

        // Normalizing coordinates
        if (h < 0) {
            y += h;
            h = Math.abs(h);
        }
        if (w < 0) {
            x += w;
            w = Math.abs(w);
        }

        this.render(ctx, { x, y, h, w }, clearCanvas);

        if (action === "up") {
            this.object.value = { h, w, x, y };
        }
    }

    move(ctx: CanvasRenderingContext2D, position: Position, action: MouseAction, clearCanvas = true) {
        const { x, y } = position;

        if (action === "down") {
            this.tmpX = this.object.value.x;
            this.tmpY = this.object.value.y;
        }

        this.IsDragging = true;
        const offsetX = x + this.tmpX;
        const offsetY = y + this.tmpY;

        this.render(ctx, { ...this.Value, x: offsetX, y: offsetY }, clearCanvas);
        this.select({ x: offsetX, y: offsetY });

        // Update value continuously or only on 'up' depending on your undo logic
        this.object.value.x = offsetX;
        this.object.value.y = offsetY;

        if (action === "up") {
            this.tmpX = 0;
            this.tmpY = 0;
            this.IsDragging = false;
        }
    }

    resize(ctx: CanvasRenderingContext2D, delta: Delta, cPos: CursorPosition, action: MouseAction, clearCanvas = true) {
        if (!this.Board.PointerOrigin) return { x: 0, y: 0, w: 0, h: 0 };

        const { dx, dy } = delta;
        this.IsDragging = true;

        if (action === "down") {
            this.tmpX = this.object.value.x;
            this.tmpY = this.object.value.y;
            this.tmpH = this.object.value.h;
            this.tmpW = this.object.value.w;
        }

        let { tmpX: x, tmpY: y, tmpH: h, tmpW: w } = this;

        // Logic for resizing based on handle position
        switch (cPos) {
            case "tl":
                x += dx;
                y += dy;
                w -= dx;
                h -= dy;
                break;
            case "tr":
                y += dy;
                w += dx;
                h -= dy;
                break;
            case "bl":
                x += dx;
                w -= dx;
                h += dy;
                break;
            case "br":
                w += dx;
                h += dy;
                break;
        }

        // Boundary flip correction
        if (h < 0) {
            y += h;
            h = Math.abs(h);
        }
        if (w < 0) {
            x += w;
            w = Math.abs(w);
        }

        this.render(ctx, { x, y, h, w }, clearCanvas);
        this.select({ h, w, x, y });

        if (action === "up") {
            this.object.value = { h, w, x, y };
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
        this.render(ctx, this.Value, true);
        this.select({});
    }

    getValues(): CircleObject {
        return this.object;
    }
}
