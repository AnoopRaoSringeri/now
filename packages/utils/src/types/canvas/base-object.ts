import { v4 as uuid } from "uuid";
import { makeObservable, observable } from "mobx";
import { CanvasBoard } from "../../lib/canvas-board";
import { CanvasHelper, DefaultStyle } from "../../lib/canvas-helpers";
import { Position, Delta, AbsPosition, Size } from "../sketch-now/canvas";
import { MouseAction, CursorPosition } from "../sketch-now/custom-canvas";
import { IObjectStyle } from "../sketch-now/object-styles";
import { CanvasObject, XYHW } from "./types";
import { ElementEnum } from "../sketch-now/enums";

export class BaseObject {
    toSVG(sRatio: Size) {
        throw new Error("Method not implemented.");
    }
    private _isSelected = false;
    private _showSelection = false;
    private _isDragging = false;
    object: CanvasObject;
    readonly Board: CanvasBoard;
    constructor(id: string, objectValue: CanvasObject, board: CanvasBoard) {
        this.object = objectValue;
        this.Board = board;
        this.id = id;
        makeObservable(this, {
            object: observable
        });
    }

    id = uuid();
    style = DefaultStyle;
    order = 0;

    get IsSelected() {
        return this._isSelected;
    }

    set IsSelected(value: boolean) {
        this._isSelected = value;
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

    get Type() {
        return this.object.type;
    }

    get Value() {
        return this.object.value;
    }

    set Value(value: CanvasObject["value"]) {
        this.object.value = value;
    }

    updateValue(
        ctx: CanvasRenderingContext2D,
        objectValue: CanvasObject["value"],
        action: MouseAction,
        clearCanvas = true
    ) {
        this.object.value = objectValue;
        switch (this.object.type) {
            case ElementEnum.AiPrompt:
            case ElementEnum.Chart:
            case ElementEnum.Image:
            case ElementEnum.Rectangle: {
                let { h, w, x, y } = this.object.value;
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
                ctx.strokeRect(x, y, w, h);
                ctx.fillRect(x, y, w, h);
                ctx.restore();
            }
        }
    }

    move(ctx: CanvasRenderingContext2D, position: Position, action: MouseAction, clearCanvas = true) {
        switch (this.object.type) {
            case ElementEnum.AiPrompt:
            case ElementEnum.Chart:
            case ElementEnum.Rectangle: {
                const { x, y } = position;
                this.Board.Helper.applyStyles(ctx, this.style);
                if (clearCanvas) {
                    this.Board.Helper.clearCanvasArea(ctx);
                }
                this.IsDragging = true;
                const offsetX = x + this.object.value.x;
                const offsetY = y + this.object.value.y;
                ctx.strokeRect(offsetX, offsetY, this.object.value.w, this.object.value.h);
                ctx.fillRect(offsetX, offsetY, this.object.value.w, this.object.value.h);
                this.select({ x: offsetX, y: offsetY });
                ctx.restore();
                if (action === "up") {
                    this.object.value.x = offsetX;
                    this.object.value.y = offsetY;
                    this.IsDragging = false;
                }
            }
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
        switch (this.object.type) {
            case ElementEnum.AiPrompt:
            case ElementEnum.Chart:
            case ElementEnum.Image:
            case ElementEnum.Rectangle: {
                let y = this.object.value.y;
                let x = this.object.value.x;
                switch (cPos) {
                    case "tl":
                        x = x + w;
                        y = y + h;
                        if (h < 0) {
                            h = Math.abs(Math.abs(h) + this.object.value.h);
                        } else {
                            h = Math.abs(this.object.value.h - Math.abs(h));
                        }
                        if (w < 0) {
                            w = Math.abs(Math.abs(w) + this.object.value.w);
                        } else {
                            w = Math.abs(this.object.value.w - Math.abs(w));
                        }
                        break;
                    case "tr":
                        y = y + h;
                        if (h < 0) {
                            h = Math.abs(this.object.value.h + Math.abs(h));
                        } else {
                            h = Math.abs(Math.abs(h) - this.object.value.h);
                        }
                        if (w < 0) {
                            w = this.object.value.w + w;
                        } else {
                            w = Math.abs(this.object.value.w + Math.abs(w));
                        }
                        break;
                    case "bl":
                        x = x + w;
                        if (h < 0) {
                            h = this.object.value.h - Math.abs(h);
                        } else {
                            h = Math.abs(Math.abs(h) + this.object.value.h);
                        }
                        if (w < 0) {
                            w = Math.abs(this.object.value.w + Math.abs(w));
                        } else {
                            w = Math.abs(this.object.value.w - Math.abs(w));
                        }
                        break;
                    case "br":
                        if (h < 0) {
                            h = h + this.object.value.h;
                        } else {
                            h = Math.abs(this.object.value.h + Math.abs(h));
                        }
                        if (w < 0) {
                            w = this.object.value.w + w;
                        } else {
                            w = Math.abs(this.object.value.w + Math.abs(w));
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
                if (x >= this.object.value.x + this.object.value.w) {
                    x = this.object.value.x + this.object.value.w;
                }
                if (y >= this.object.value.y + this.object.value.h) {
                    y = this.object.value.y + this.object.value.h;
                }
                if (h < 0) {
                    y = y + h;
                    h = Math.abs(h);
                }
                if (w < 0) {
                    x = x + w;
                    w = Math.abs(w);
                }
                ctx.strokeRect(x, y, w, h);
                ctx.fillRect(x, y, w, h);
                ctx.restore();

                this.select({ h, w, x, y });
                if (action === "up") {
                    this.object.value.h = h;
                    this.object.value.w = w;
                    this.object.value.x = x;
                    this.object.value.y = y;
                    this.IsDragging = false;
                }
                return { x, y, h, w };
            }
            default:
                return { x: 0, y: 0, h, w };
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        //
    }

    create(ctx: CanvasRenderingContext2D) {
        const { x, y, h, w } = this.Cords;
        this.Board.Helper.applyStyles(ctx, this.style);
        ctx.strokeRect(x, y, w, h);
        ctx.fillRect(x, y, w, h);
    }

    updateStyle<T extends keyof IObjectStyle>(
        ctx: CanvasRenderingContext2D,
        key: T,
        value: IObjectStyle[T],
        clearCanvas = true
    ) {
        this.style[key] = value;
        this.Board.Helper.applyStyles(ctx, this.style);
        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }
        this.Board.Helper.applyStyles(ctx, this.style);
        this.Board.Helper.clearCanvasArea(ctx);
    }

    select(cords: Partial<XYHW>) {
        const { x = this.Cords.x, y = this.Cords.y, w = this.Cords.w, h = this.Cords.h } = cords;
        this.IsSelected = true;
        if (this.Board.CanvasCopy && this._showSelection) {
            const copyCtx = this.Board.CanvasCopy.getContext("2d");
            if (copyCtx) {
                switch (this.object.type) {
                    case ElementEnum.Image: {
                        const metrics = copyCtx.measureText(this.object.value.value);
                        CanvasHelper.applySelection(copyCtx, {
                            height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
                            width: metrics.width,
                            x,
                            y
                        });
                        break;
                    }
                    default:
                        CanvasHelper.applySelection(copyCtx, { height: h, width: w, x, y });
                }
            }
        }
    }

    unSelect() {
        this.IsSelected = false;
        this.ShowSelection = false;
    }

    getPosition(): Position & AbsPosition {
        return { ax: 0, ay: 0, y: 0, x: 0 };
    }
    getValues(): CanvasObject {
        return this.object;
    }
    get Cords() {
        const { type, value } = this.object;
        let x, y, h, w;
        x = y = h = w = 0;
        switch (type) {
            case ElementEnum.AiPrompt:
            case ElementEnum.Chart:
            case ElementEnum.Circle:
            case ElementEnum.Image:
            case ElementEnum.Rectangle: {
                ({ x, y, h, w } = value);
                return { x, y, h, w };
            }
            case ElementEnum.Square: {
                ({ x, y, h } = value);
                return { x, y, h, w: h };
            }
            default:
                return { x, y, h, w };
        }
    }
}
