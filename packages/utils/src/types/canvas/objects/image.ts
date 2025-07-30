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
        this.IsDragging = true;
        const offsetX = x + this.object.value.x;
        const offsetY = y + this.object.value.y;
        ctx.drawImage(this.image, offsetX, offsetY, this.Value.w, this.Value.h);
        this.select({ x: offsetX, y: offsetY });
        ctx.restore();
        if (action === "up") {
            this.object.value.x = offsetX;
            this.object.value.y = offsetY;
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
        ctx.drawImage(this.image, x, y, w, h);

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

    getValues(): ImageObject {
        return this.object;
    }
}
