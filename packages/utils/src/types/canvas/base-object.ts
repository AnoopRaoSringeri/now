import { computed, makeObservable, observable, runInAction, toJS } from "mobx";
import { v4 as uuid } from "uuid";
import { CanvasBoard } from "../../lib/canvas-board";
import { CanvasHelper, DefaultStyle } from "../../lib/canvas-helpers";
import { AbsPosition, CanvasElement, Delta, Position, Size } from "../sketch-now/canvas";
import { CursorPosition, MouseAction } from "../sketch-now/custom-canvas";
import { ElementEnum } from "../sketch-now/enums";
import { IObjectStyle } from "../sketch-now/object-styles";
import { CanvasObject, XYHW } from "./types";

export class BaseObject {
    toSVG(sRatio: Size) {
        throw new Error("Method not implemented.");
    }
    readonly Board: CanvasBoard;
    isSelected = false;
    private _showSelection = false;
    private _isDragging = false;
    object: CanvasObject;
    isLocked = false;
    constructor(id: string, objectValue: CanvasObject, board: CanvasBoard, style: IObjectStyle) {
        this.object = objectValue;
        this.style = style;
        this.Board = board;
        this.id = id;
        makeObservable(this, {
            object: observable,
            Cords: computed,
            isLocked: observable,
            isSelected: observable
        });
    }
    protected tmpX = 0;
    protected tmpY = 0;
    protected tmpH = 0;
    protected tmpW = 0;
    id = uuid();
    style = DefaultStyle();
    order = 0;

    get IsSelected() {
        return this.isSelected;
    }

    set IsSelected(value: boolean) {
        runInAction(() => {
            this.isSelected = value;
        });
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

    set Style(style: IObjectStyle) {
        runInAction(() => {
            this.style = style;
        });
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

    get IsLocked() {
        return this.isLocked;
    }

    set IsLocked(value: boolean) {
        runInAction(() => {
            this.isLocked = value;
        });
    }

    updateValue(
        ctx: CanvasRenderingContext2D,
        objectValue: CanvasObject["value"],
        action: MouseAction,
        clearCanvas = true
    ) {
        if (!this.Board.PointerOrigin) {
            return;
        }
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
                break;
            }
            case ElementEnum.Square: {
                let { x, y } = this.object.value;
                const h = this.object.value.h;
                const w = this.Board.CurrentPointer.x - this.Board.PointerOrigin.x;
                this.Board.Helper.applyStyles(ctx, this.style);
                if (clearCanvas) {
                    this.Board.Helper.clearCanvasArea(ctx);
                }
                const ah = Math.min(Math.abs(w), Math.abs(h));
                if (h < 0 && w < 0) {
                    x = this.Board.PointerOrigin.x - ah;
                    y = this.Board.PointerOrigin.y - ah;
                } else if (h < 0) {
                    y = this.Board.PointerOrigin.y - ah;
                } else if (w < 0) {
                    x = this.Board.PointerOrigin.x - ah;
                }
                if (action === "up") {
                    this.object.value = { h: ah, x, y };
                }
                ctx.strokeRect(x, y, ah, ah);
                ctx.fillRect(x, y, ah, ah);
                ctx.restore();
            }
        }
    }

    move(ctx: CanvasRenderingContext2D, position: Position, action: MouseAction, clearCanvas = true) {
        runInAction(() => {
            switch (this.object.type) {
                case ElementEnum.Text: {
                    const { x, y } = position;
                    this.Board.Helper.applyStyles(ctx, this.style);
                    if (clearCanvas) {
                        this.Board.Helper.clearCanvasArea(ctx);
                    }
                    if (action === "down") {
                        this.tmpX = this.object.value.x;
                        this.tmpY = this.object.value.y;
                        this.IsSelected = true;
                    }
                    this.IsDragging = true;
                    const offsetX = x + this.tmpX;
                    const offsetY = y + this.tmpY;
                    this.object.value.x = offsetX;
                    this.object.value.y = offsetY;
                    this.draw(ctx);
                    ctx.restore();
                    if (action === "up") {
                        this.tmpX = 0;
                        this.tmpY = 0;
                        this.IsDragging = false;
                    }
                    break;
                }
                case ElementEnum.AiPrompt:
                case ElementEnum.Chart:
                case ElementEnum.Rectangle: {
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
                    ctx.strokeRect(offsetX, offsetY, this.object.value.w, this.object.value.h);
                    ctx.fillRect(offsetX, offsetY, this.object.value.w, this.object.value.h);
                    this.select({ x: offsetX, y: offsetY });
                    ctx.restore();
                    this.object.value.x = offsetX;
                    this.object.value.y = offsetY;
                    if (action === "up") {
                        this.tmpX = 0;
                        this.tmpY = 0;
                        this.IsDragging = false;
                    }
                    break;
                }
                case ElementEnum.Square: {
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
                    ctx.strokeRect(offsetX, offsetY, this.object.value.h, this.object.value.h);
                    ctx.fillRect(offsetX, offsetY, this.object.value.h, this.object.value.h);
                    this.select({ x: offsetX, y: offsetY });
                    ctx.restore();
                    this.object.value.x = offsetX;
                    this.object.value.y = offsetY;
                    if (action === "up") {
                        this.tmpX = 0;
                        this.tmpY = 0;
                        this.IsDragging = false;
                    }
                }
            }
        });
    }

    resize(ctx: CanvasRenderingContext2D, delta: Delta, cPos: CursorPosition, action: MouseAction, clearCanvas = true) {
        return runInAction(() => {
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
            switch (this.object.type) {
                case ElementEnum.AiPrompt:
                case ElementEnum.Chart:
                case ElementEnum.Image:
                case ElementEnum.Rectangle: {
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
                    ctx.strokeRect(x, y, w, h);
                    ctx.fillRect(x, y, w, h);
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
                case ElementEnum.Square: {
                    if (action === "down") {
                        this.tmpX = this.object.value.x;
                        this.tmpY = this.object.value.y;
                        this.tmpH = this.object.value.h;
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
                                w = Math.abs(Math.abs(w) + this.tmpH);
                            } else {
                                w = Math.abs(this.tmpH - Math.abs(w));
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
                                w = this.tmpH + w;
                            } else {
                                w = Math.abs(this.tmpH + Math.abs(w));
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
                                w = Math.abs(this.tmpH + Math.abs(w));
                            } else {
                                w = Math.abs(this.tmpH - Math.abs(w));
                            }
                            break;
                        case "br":
                            if (h < 0) {
                                h = h + this.tmpH;
                            } else {
                                h = Math.abs(this.tmpH + Math.abs(h));
                            }
                            if (w < 0) {
                                w = this.tmpH + w;
                            } else {
                                w = Math.abs(this.tmpH + Math.abs(w));
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
                    if (x >= this.tmpX + this.tmpH) {
                        x = this.tmpX + this.tmpH;
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
                    const side = Math.min(w, h);
                    ctx.strokeRect(x, y, side, side);
                    ctx.fillRect(x, y, side, side);
                    ctx.restore();
                    this.select({ h: side, w: side, x, y });
                    this.object.value.h = side;
                    this.object.value.x = x;
                    this.object.value.y = y;
                    if (action === "up") {
                        this.tmpX = 0;
                        this.tmpY = 0;
                        this.tmpH = 0;
                        this.tmpW = 0;
                        this.IsDragging = false;
                    }
                    return { x, y, h: side, w: side };
                }
                default:
                    return { x: 0, y: 0, h, w };
            }
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        switch (this.object.type) {
            case ElementEnum.AiPrompt:
            case ElementEnum.Chart:
            case ElementEnum.Image:
            case ElementEnum.Square:
            case ElementEnum.Rectangle: {
                this.Board.Helper.applyStyles(ctx, this.style);
                if (this.IsSelected) {
                    this.select({ x: this.object.value.x, y: this.object.value.y });
                }
                ctx.restore();
            }
        }
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
        if (clearCanvas) {
            this.Board.Helper.clearCanvasArea(ctx);
        }
        const { x, y, h, w } = this.Cords;
        this.Board.Helper.applyStyles(ctx, this.style);
        ctx.strokeRect(x, y, w, h);
        ctx.fillRect(x, y, w, h);
        this.select({});
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
                    case ElementEnum.Text: {
                        const metrics = copyCtx.measureText(this.object.value.value);
                        CanvasHelper.applySelection(copyCtx, {
                            height: h,
                            width: w,
                            x,
                            y: y - metrics.fontBoundingBoxAscent / 2
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
        console.log("Unselect :", this.id);
        this.IsSelected = false;
        this.ShowSelection = false;
    }

    getPosition(): Position & AbsPosition {
        return { ax: 0, ay: 0, y: 0, x: 0 };
    }
    getValues(): CanvasObject {
        return toJS(this.object);
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
            case ElementEnum.Pencil: {
                const { points } = value;
                let x = Number.POSITIVE_INFINITY;
                let y = Number.POSITIVE_INFINITY;
                let h = Number.MIN_SAFE_INTEGER;
                let w = Number.MIN_SAFE_INTEGER;
                points.forEach(([px, py]) => {
                    x = Math.min(x, px);
                    y = Math.min(y, py);
                    h = Math.max(h, py);
                    w = Math.max(w, px);
                });
                h = h - y;
                w = w - x;
                return { x, y, h, w };
            }
            case ElementEnum.Text: {
                ({ x, y } = value);
                return { x, y, h, w };
            }
            default:
                return { x, y, h, w };
        }
    }
    toJSON(): CanvasElement {
        return { ...this.object, id: this.id, style: this.Style };
    }
}
