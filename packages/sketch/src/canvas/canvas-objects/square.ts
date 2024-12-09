import { makeObservable } from "mobx";
import { v4 as uuid } from "uuid";

import { CanvasBoard } from "../canvas-board";
import {
    ICanvasObjectWithId,
    ElementEnum,
    PartialCanvasObject,
    IObjectValue,
    MouseAction,
    IObjectStyle,
    Position,
    Delta,
    CursorPosition,
    ObjectOptions,
    Size
} from "@now/utils";
import { DefaultStyle, CanvasHelper } from "../../helpers/canvas-helpers";

export class Square implements ICanvasObjectWithId {
    readonly Board: CanvasBoard;
    type: ElementEnum = ElementEnum.Square;
    id = uuid();
    style = DefaultStyle;
    order = 0;
    constructor({ x, y, h, id, style, order }: PartialCanvasObject, parent: CanvasBoard) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.h = h ?? 0;
        this.id = id;
        this.style = { ...(style ?? DefaultStyle) };
        this.Board = parent;
        this.order = order ?? 0;
        makeObservable(this);
    }
    x = 0;
    y = 0;
    h = 0;
    private _isSelected = false;
    private _showSelection = false;
    _isDragging = false;

    get IsSelected() {
        return this._isSelected;
    }

    get IsDragging() {
        return this._isDragging;
    }

    set IsDragging(value: boolean) {
        this._isDragging = value;
    }

    get Style() {
        return this.style;
    }

    get ShowSelection() {
        return this._showSelection;
    }

    set ShowSelection(value: boolean) {
        this._showSelection = value;
    }

    select({ x = this.x, y = this.y, h = this.h, w = this.h }: Partial<IObjectValue>) {
        this._isSelected = true;
        if (this.Board.CanvasCopy && this._showSelection) {
            const copyCtx = this.Board.CanvasCopy.getContext("2d");
            if (copyCtx) {
                CanvasHelper.applySelection(copyCtx, { height: h, width: w, x, y });
            }
        }
    }

    unSelect() {
        this._isSelected = false;
        this._showSelection = false;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.create(ctx);
        if (this.IsSelected) {
            this.select({ x: this.x, y: this.y });
        }
        ctx.restore();
    }

    create(ctx: CanvasRenderingContext2D) {
        this.Board.Helper.applyStyles(ctx, this.style);
        ctx.strokeRect(this.x, this.y, this.h, this.h);
        ctx.fillRect(this.x, this.y, this.h, this.h);
    }

    update(ctx: CanvasRenderingContext2D, objectValue: Partial<IObjectValue>, action: MouseAction, clearCanvas = true) {
        let { h = this.h, w = this.h, x = this.x, y = this.y } = objectValue;
        this.Board.Helper.applyStyles(ctx, this.style);

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
        const side = Math.min(h, w);
        ctx.strokeRect(x, y, side, side);
        ctx.fillRect(x, y, side, side);
        ctx.restore();
        if (action === "up") {
            this.h = side;
            this.x = x;
            this.y = y;
        }
    }

    updateStyle<T extends keyof IObjectStyle>(ctx: CanvasRenderingContext2D, key: T, value: IObjectStyle[T]) {
        this.style[key] = value;
        this.Board.Helper.applyStyles(ctx, this.style);
        this.Board.Helper.clearCanvasArea(ctx);
        ctx.strokeRect(this.x, this.y, this.h, this.h);
        ctx.fillRect(this.x, this.y, this.h, this.h);
    }

    move(ctx: CanvasRenderingContext2D, position: Position, action: MouseAction, clearCanvas = true) {
        const { x, y } = position;
        this.Board.Helper.applyStyles(ctx, this.style);
        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }
        this.IsDragging = true;
        const offsetX = x + this.x;
        const offsetY = y + this.y;
        ctx.strokeRect(offsetX, offsetY, this.h, this.h);
        ctx.fillRect(offsetX, offsetY, this.h, this.h);
        this.select({ x: offsetX, y: offsetY });
        ctx.restore();
        if (action === "up") {
            this.x = offsetX;
            this.y = offsetY;
            this.IsDragging = false;
        }
    }

    resize(ctx: CanvasRenderingContext2D, delta: Delta, cPos: CursorPosition, action: MouseAction, clearCanvas = true) {
        const { dx, dy } = delta;
        this.Board.Helper.applyStyles(ctx, this.style);
        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }
        this.IsDragging = true;
        let w = dx;
        let h = dy;
        let y = this.y;
        let x = this.x;
        switch (cPos) {
            case "tl":
                x = x + w;
                y = y + h;
                if (h < 0) {
                    h = Math.abs(Math.abs(h) + this.h);
                } else {
                    h = Math.abs(this.h - Math.abs(h));
                }
                if (w < 0) {
                    w = Math.abs(Math.abs(w) + this.h);
                } else {
                    w = Math.abs(this.h - Math.abs(w));
                }
                break;
            case "tr":
                y = y + h;
                if (h < 0) {
                    h = Math.abs(this.h + Math.abs(h));
                } else {
                    h = Math.abs(Math.abs(h) - this.h);
                }
                if (w < 0) {
                    w = this.h + w;
                } else {
                    w = Math.abs(this.h + Math.abs(w));
                }
                break;
            case "bl":
                x = x + w;
                if (h < 0) {
                    h = this.h - Math.abs(h);
                } else {
                    h = Math.abs(Math.abs(h) + this.h);
                }
                if (w < 0) {
                    w = Math.abs(this.h + Math.abs(w));
                } else {
                    w = Math.abs(this.h - Math.abs(w));
                }
                break;
            case "br":
                if (h < 0) {
                    h = h + this.h;
                } else {
                    h = Math.abs(this.h + Math.abs(h));
                }
                if (w < 0) {
                    w = this.h + w;
                } else {
                    w = Math.abs(this.h + Math.abs(w));
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
        if (x >= this.x + this.h) {
            x = this.x + this.h;
        }
        if (y >= this.y + this.h) {
            y = this.y + this.h;
        }
        if (h < 0) {
            y = y + h;
            h = Math.abs(h);
        }
        if (w < 0) {
            x = x + w;
            w = Math.abs(w);
        }
        const side = Math.min(w, h);
        ctx.strokeRect(x, y, side, side);
        ctx.fillRect(x, y, side, side);
        ctx.restore();

        this.select({ h: side, w: side, x, y });
        if (action === "up") {
            this.h = side;
            this.x = x;
            this.y = y;
            this.IsDragging = false;
        }
        return { x, y, h, w };
    }

    set<T extends keyof ObjectOptions>(key: T, value: ObjectOptions[T]) {
        this[key] = value;
    }

    getValues() {
        return {
            type: this.type,
            id: this.id,
            h: this.h,
            w: this.h,
            x: this.x,
            y: this.y,
            style: this.style,
            order: this.order
        };
    }

    getPosition() {
        return CanvasHelper.getAbsolutePosition({ x: this.x, y: this.y }, this.Board.Transform);
    }

    toSVG(options: Size) {
        const side = Math.max(this.h * options.width, this.h * options.height);
        return `<rect width="${side}" height="${side}" x="${this.x * options.width}" y="${
            this.y * options.height
        }" style="${CanvasHelper.getHTMLStyle(this.style, options)}" />`;
    }
}
