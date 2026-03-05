import { computed, makeObservable, observable, runInAction, toJS } from "mobx";
import { v4 as uuid } from "uuid";
import { CanvasBoard } from "../../lib/canvas-board";
import { CanvasHelper, DefaultStyle } from "../../lib/canvas-helpers";
import { AbsPosition, CanvasElement, Delta, Position } from "../sketch-now/canvas";
import { CursorPosition, MouseAction } from "../sketch-now/custom-canvas";
import { ElementEnum } from "../sketch-now/enums";
import { IObjectStyle } from "../sketch-now/object-styles";
import { CanvasObject, XYHW } from "./types";
import { IBaseObject } from "../sketch-now/canvas-object";

export class BaseObject<T extends CanvasObject = CanvasObject> implements IBaseObject<T> {
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

    set Value(value: T["value"]) {
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

    updateValue(ctx: CanvasRenderingContext2D, objectValue: T["value"], action: MouseAction, clearCanvas = true) {
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
            const w = dx;
            const h = dy;
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

                    // 1. Identify the 'Fixed' anchor point (the corner that doesn't move)
                    let anchorX = this.tmpX;
                    let anchorY = this.tmpY;

                    // 2. Identify the 'Moving' point (the handle being dragged)
                    // Initially, it's where the handle was before the drag started
                    let moveX = this.tmpX + this.tmpW;
                    let moveY = this.tmpY + this.tmpH;

                    switch (cPos) {
                        case "tl":
                            anchorX = this.tmpX + this.tmpW;
                            anchorY = this.tmpY + this.tmpH;
                            moveX = this.tmpX + w;
                            moveY = this.tmpY + h;
                            break;
                        case "tr":
                            anchorX = this.tmpX;
                            anchorY = this.tmpY + this.tmpH;
                            moveX = this.tmpX + this.tmpW + w;
                            moveY = this.tmpY + h;
                            break;
                        case "bl":
                            anchorX = this.tmpX + this.tmpW;
                            anchorY = this.tmpY;
                            moveX = this.tmpX + w;
                            moveY = this.tmpY + this.tmpH + h;
                            break;
                        case "br":
                            anchorX = this.tmpX;
                            anchorY = this.tmpY;
                            moveX = this.tmpX + this.tmpW + w;
                            moveY = this.tmpY + this.tmpH + h;
                            break;
                        case "t":
                            moveY = this.tmpY + h;
                            anchorY = this.tmpY + this.tmpH;
                            break;
                        case "b":
                            moveY = this.tmpY + this.tmpH + h;
                            break;
                        case "l":
                            moveX = this.tmpX + w;
                            anchorX = this.tmpX + this.tmpW;
                            break;
                        case "r":
                            moveX = this.tmpX + this.tmpW + w;
                            break;
                    }

                    // 3. Normalize: The top-left (x, y) is always the minimum of the two points
                    const x = Math.min(anchorX, moveX);
                    const y = Math.min(anchorY, moveY);
                    const width = Math.abs(anchorX - moveX);
                    const height = Math.abs(anchorY - moveY);

                    // 4. Update State and Draw
                    this.object.value = { x, y, w: width, h: height };
                    this.select(this.object.value);

                    ctx.strokeRect(x, y, width, height);
                    ctx.fillRect(x, y, width, height);
                    ctx.restore();

                    if (action === "up") {
                        this.IsDragging = false;
                        this.tmpX = 0;
                        this.tmpY = 0;
                        this.tmpH = 0;
                        this.tmpW = 0;
                    }

                    return { x, y, w: width, h: height };
                }
                case ElementEnum.Square: {
                    if (action === "down") {
                        this.tmpX = this.object.value.x;
                        this.tmpY = this.object.value.y;
                        this.tmpH = this.object.value.h;
                        this.tmpW = this.object.value.h; // Store initial size
                    }

                    let x = this.tmpX;
                    let y = this.tmpY;
                    let side = this.tmpH;

                    // w and h are dx and dy
                    // We use Math.abs or direction logic to determine the new side length
                    switch (cPos) {
                        case "br":
                            // Anchor is Top-Left (x, y). Side grows by the average or max of dx/dy
                            side = Math.max(this.tmpH + Math.min(w, h));
                            break;

                        case "tr":
                            // Anchor is Bottom-Left (x, tmpY + tmpH).
                            // Moving mouse UP (negative h) increases height.
                            side = this.tmpH + Math.min(w, -h);
                            y = this.tmpY + this.tmpH - side;
                            break;

                        case "bl":
                            // Anchor is Top-Right (tmpX + tmpW, y).
                            // Moving mouse LEFT (negative w) increases width.
                            side = this.tmpH + Math.min(-w, h);
                            x = this.tmpX + this.tmpW - side;
                            break;

                        case "tl":
                            // Anchor is Bottom-Right. Both x and y move.
                            side = this.tmpH + Math.min(-w, -h);
                            x = this.tmpX + this.tmpW - side;
                            y = this.tmpY + this.tmpH - side;
                            break;
                    }

                    if (side < 0) {
                        y = y + side;
                        x = x + side;
                        side = Math.abs(side);
                    }

                    ctx.strokeRect(x, y, side, side);
                    ctx.fillRect(x, y, side, side);
                    ctx.restore();
                    this.select({ h: side, w: side, x, y });
                    // Apply updates
                    this.object.value.x = x;
                    this.object.value.y = y;
                    this.object.value.h = side;
                    if (action === "up") {
                        this.IsDragging = false;
                        this.tmpX = 0;
                        this.tmpY = 0;
                        this.tmpH = 0;
                        this.tmpW = 0;
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
