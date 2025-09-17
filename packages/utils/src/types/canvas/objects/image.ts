import { BaseObject } from "../base-object";
import { ImageObject, XYHW } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";
import { CanvasHelper } from "../../../lib/canvas-helpers";
import { Delta, Position } from "../../sketch-now/canvas";
import { CursorPosition, MouseAction } from "../../sketch-now/custom-canvas";
import { IObjectStyle } from "../../sketch-now/object-styles";

export class CanvasImage extends BaseObject {
    object: ImageObject;
    image = new Image();
    constructor(id: string, object: ImageObject, board: CanvasBoard, style: IObjectStyle) {
        super(id, object, board, style);
        this.object = object;
    }

    get Value() {
        return this.object.value;
    }

    create(ctx: CanvasRenderingContext2D) {
        this.draw(ctx);
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.Value.value === "") {
            return;
        }
        this.Board.Helper.applyStyles(ctx, this.style);
        if (this.image.src === "" || this.image.src == null) {
            this.image.src = this.Value.value;
            this.image.onload = () => {
                ctx.drawImage(this.image, this.Value.x, this.Value.y);
                this.Value.w = this.image.width;
                this.Value.h = this.image.height;
            };
        } else {
            ctx.drawImage(this.image, this.Value.x, this.Value.y, this.Value.w, this.Value.h);
        }
        if (this.IsSelected) {
            this.select({});
        }
        ctx.restore();
    }

    select(cords: Partial<XYHW>) {
        const { x = this.Cords.x, y = this.Cords.y, w = this.Cords.w, h = this.Cords.h } = cords;
        this.IsSelected = true;
        if (this.Board.CanvasCopy && this.ShowSelection) {
            const copyCtx = this.Board.CanvasCopy.getContext("2d");
            if (copyCtx) {
                CanvasHelper.applySelection(copyCtx, {
                    height: h,
                    width: w,
                    x,
                    y
                });
            }
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
        this.IsDragging = true;
        ctx.drawImage(this.image, offsetX, offsetY, this.Value.w, this.Value.h);
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

    resize(ctx: CanvasRenderingContext2D, delta: Delta, cPos: CursorPosition, action: MouseAction, clearCanvas = true) {
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
        ctx.drawImage(this.image, x, y, w, h);

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

    getValues(): ImageObject {
        return this.object;
    }
}
