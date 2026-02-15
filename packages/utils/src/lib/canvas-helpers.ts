import { CSSProperties } from "react";
import { BaseObject } from "../types/canvas/base-object";
import { CanvasObject } from "../types/canvas/types";
import { Position, Size } from "../types/sketch-now/canvas";
import { CursorPosition, ICanvas, ICanvasTransform } from "../types/sketch-now/custom-canvas";
import { ElementEnum } from "../types/sketch-now/enums";
import { Font, IObjectStyle } from "../types/sketch-now/object-styles";

export const DefaultFont = (): Font => ({
    color: "white",
    style: "normal",
    varient: "normal",
    weight: 200,
    size: 30,
    family: "Arial"
});

export const DefaultStyle = (withFont?: boolean): IObjectStyle => ({
    fillColor: "transparent",
    strokeStyle: "#fff",
    strokeWidth: 1,
    opacity: 100,
    font: withFont ? DefaultFont() : null
});

export const SelectionStyle: IObjectStyle = {
    fillColor: "#ccffff10",
    strokeStyle: "#ccffff",
    strokeWidth: 0.1,
    opacity: 100,
    font: null
};

const HOVER_OFFSET = 10;

export const GUTTER = 5;

export const SELECTOR_POINT_RADIUS = 5;

export const CANVAS_SCALING_FACTOR = 0.0001;
export const CANVAS_SCALING_LIMIT = 0.001;
export const CANVAS_SCALING_MULTIPLIER = 100;
export const CANVAS_ZOOM_IN_OUT_FACTOR = 0.05;

export const MIN_INTERVAL = 15;

export const SELECTION_ELEMENT_ID = "select-element";

export const DEFAULT_TRANSFORM: ICanvasTransform = {
    scaleX: 1,
    b: 0,
    c: 0,
    scaleY: 1,
    transformX: 0,
    transformY: 0
};

export class CanvasHelper {
    Board: ICanvas;
    constructor(board: ICanvas) {
        this.Board = board;
    }

    static getHeightRatio(canvasHeight: number, newHeight: number) {
        return newHeight / canvasHeight;
    }

    static getWidthRatio(canvasWidth: number, newWidth: number) {
        return newWidth / canvasWidth;
    }

    static getSizeRatio(nSize: Size, cSize: Size): Size {
        return { height: nSize.height / cSize.height, width: nSize.width / cSize.width };
    }

    getCursorPosition(mousePosition: Position, { type, value }: CanvasObject): CursorPosition {
        const { x, y } = mousePosition;
        let cx = 0;
        let cy = 0;
        let h = 0;
        let w = 0;
        switch (type) {
            case ElementEnum.Square:
                ({ y: cy, x: cx, h } = value);
                w = h;
                break;
            case ElementEnum.Rectangle:
            case ElementEnum.Circle:
            case ElementEnum.Image:
            case ElementEnum.Chart:
            case ElementEnum.AiPrompt:
                ({ h, y: cy, x: cx, w } = value);
        }
        //TODO: Style
        const wFactor = 0;
        const ucx = cx + -wFactor;
        const ucy = cy + -wFactor;
        const uh = h + ucy + wFactor * 2;
        const uw = w + ucx + wFactor * 2;
        const hOffSet = HOVER_OFFSET / this.Board.Transform.scaleX;
        switch (type) {
            case ElementEnum.Square:
            case ElementEnum.Circle:
            case ElementEnum.Rectangle:
            case ElementEnum.Image:
            case ElementEnum.Chart:
            case ElementEnum.AiPrompt:
                return x >= ucx - hOffSet && x <= ucx + hOffSet && y >= ucy - hOffSet && y <= ucy + hOffSet
                    ? "tl"
                    : x >= ucx - hOffSet && x <= ucx + hOffSet && y >= uh - hOffSet && y <= uh + hOffSet
                    ? "bl"
                    : x >= uw - hOffSet && x <= uw + hOffSet && y >= ucy - hOffSet && y <= ucy + hOffSet
                    ? "tr"
                    : x >= uw - hOffSet && x <= uw + hOffSet && y >= uh - hOffSet && y <= uh + hOffSet
                    ? "br"
                    : "m";
            default:
                return "m";
        }
    }

    static getCursor(position: CursorPosition) {
        switch (position) {
            case "tl":
            case "br":
                return "se-resize";
            case "tr":
            case "bl":
                return "sw-resize";
            case "m":
                return "move";
            default:
                return "default";
        }
    }

    static getBoundingArea({ type, value }: CanvasObject) {
        switch (type) {
            case ElementEnum.Circle: {
                const { x, y, h, w } = value;
                return { w: w / 2, h: h / 2, x: x + w / 2, y: y + h / 2 };
            }
            case ElementEnum.Pencil: {
                const { points } = value;
                let lx = Number.POSITIVE_INFINITY;
                let ly = Number.POSITIVE_INFINITY;
                let lh = Number.MIN_VALUE;
                let lw = Number.MIN_VALUE;
                points.forEach(([px, py]) => {
                    lx = Math.min(lx, px);
                    ly = Math.min(ly, py);
                    lh = Math.max(lh, py);
                    lw = Math.max(lw, px);
                });
                lh = lh - ly;
                lw = lw - lx;
                return { x: lx, y: ly, h: lh, w: lw };
            }
            default:
                return { x: 0, y: 0, h: 0, w: 0 };
        }
    }

    isUnderMouse(mousePosition: Position, { type, value }: CanvasObject) {
        const { x, y } = mousePosition;
        let cx = 0;
        let cy = 0;
        let h = 0;
        let w = 0;
        let points: [number, number][] = [];
        switch (type) {
            case ElementEnum.Square:
                ({ y: cy, x: cx, h } = value);
                break;
            case ElementEnum.Rectangle:
            case ElementEnum.Circle:
            case ElementEnum.Image:
            case ElementEnum.Chart:
            case ElementEnum.AiPrompt:
                ({ h, y: cy, x: cx, w } = value);
                break;
            case ElementEnum.Pencil:
                ({ points } = value);
                break;
            case ElementEnum.Text:
                ({ x: cx, y: cy, h, w } = value);
        }
        //TODO: Style
        const wFactor = 0;
        const ucx = cx + -wFactor;
        const ucy = cy + -wFactor;
        const uh = h + wFactor * 2;
        const uw = w + wFactor * 2;
        const [lpx, lpy] = points.length > 0 ? points[0] : [0, 0];
        const hOffSet = HOVER_OFFSET / this.Board.Transform.scaleX;

        return (
            (x >= ucx && x <= ucx + uw && y >= ucy && y <= ucy + uh) ||
            (x >= ucx && x <= ucx + uh && y >= ucy && y <= ucy + uh) ||
            // (x >= cx - ur && y >= cy - ur && x <= cx + ur && y <= cy + ur) ||
            points.find(
                ([px, py]) =>
                    px - (hOffSet + wFactor) <= x &&
                    x <= px + hOffSet + wFactor &&
                    py - (hOffSet + wFactor) <= y &&
                    y <= py + hOffSet + wFactor
            ) != null ||
            // (x === ucx && y === ucy) ||
            (x === lpx + wFactor && y === lpy + wFactor)
            // Math.sqrt(Math.pow(cx - x, 2) + Math.pow(cy - y, 2))
        );
    }

    static isUnderArea({ height, width, x: px, y: py }: Position & Size, { type, value }: CanvasObject) {
        let h = 0;
        let w = 0;
        let x = 0;
        let y = 0;
        switch (type) {
            case ElementEnum.Rectangle:
            case ElementEnum.Image:
            case ElementEnum.Chart:
            case ElementEnum.AiPrompt: {
                h = value.h;
                w = value.w;
                x = value.x;
                y = value.y;
                break;
            }
            case ElementEnum.Circle:
            case ElementEnum.Square:
                break;
            case ElementEnum.Pencil: {
                const { points } = value;
                let lx = Number.POSITIVE_INFINITY;
                let ly = Number.POSITIVE_INFINITY;
                let lh = Number.MIN_SAFE_INTEGER;
                let lw = Number.MIN_SAFE_INTEGER;
                points.forEach(([px, py]) => {
                    lx = Math.min(lx, px);
                    ly = Math.min(ly, py);
                    lh = Math.max(lh, py);
                    lw = Math.max(lw, px);
                });
                lh = lh - ly;
                lw = lw - lx;
                h = lh;
                w = lw;
                x = lx;
                y = ly;
                break;
            }
        }
        return h <= height && w <= width && x >= px && y >= py && h + y <= height + py && w + x <= width + px;
    }

    hoveredElement(mouseCords: Position, elements: BaseObject[]) {
        return this.Board.ReadOnly
            ? null
            : elements.find(
                  (e) =>
                      this.isUnderMouse(mouseCords, e.getValues()) ||
                      this.getCursorPosition(mouseCords, e.getValues()) !== "m"
              );
    }

    static getElementsInsideArea(area: Position & Size, elements: BaseObject[]) {
        return elements.filter((e) => this.isUnderArea(area, e.getValues()));
    }

    static getHTMLStyle(style: IObjectStyle, { height, width }: Size) {
        return `fill: ${style.fillColor}; stroke: ${style.strokeStyle}; stroke-width: ${
            style.strokeWidth * Math.max(height, width)
        }px;`;
    }

    static getCurrentMousePosition(event: MouseEvent, { transformX: e, transformY: f, scaleX: a }: ICanvasTransform) {
        const { offsetX: x, offsetY: y } = event;
        return { offsetX: (x - e) / a, offsetY: (y - f) / a };
    }

    static getCurrentPosition({ x, y }: Position, { transformX: e, transformY: f, scaleX: a }: ICanvasTransform) {
        return { offsetX: (x - e) / a, offsetY: (y - f) / a };
    }

    static getAbsolutePosition({ x, y }: Position, { transformX: e, transformY: f, scaleX: a }: ICanvasTransform) {
        return { x, y, ax: x * a + e, ay: y * a + f };
    }

    static getAbsoluteSize({ height, width }: Size, { scaleX: a }: ICanvasTransform) {
        return { aw: width * a, ah: height * a };
    }

    static getSelectedAreaBoundary(elements: BaseObject[]) {
        let x = Number.POSITIVE_INFINITY;
        let y = Number.POSITIVE_INFINITY;
        let h = Number.MIN_SAFE_INTEGER;
        let w = Number.MIN_SAFE_INTEGER;
        elements.forEach((ele) => {
            const { type, value } = ele.getValues();
            switch (type) {
                case ElementEnum.Circle:
                case ElementEnum.Square: {
                    break;
                }
                case ElementEnum.Rectangle:
                case ElementEnum.Image:
                case ElementEnum.Chart:
                case ElementEnum.AiPrompt: {
                    const { x: ex, y: ey, h: eh, w: ew } = value;
                    x = Math.min(x, ex);
                    y = Math.min(y, ey);
                    h = Math.max(h, eh + ey);
                    w = Math.max(w, ew + ex);
                    break;
                }
                case ElementEnum.Line: {
                    const { sx: lx, sy: ly } = value;
                    x = lx;
                    y = ly;
                    break;
                }
                case ElementEnum.Pencil: {
                    const { points } = value;
                    points.forEach(([px, py]) => {
                        x = Math.min(x, px);
                        y = Math.min(y, py);
                        h = Math.max(h, py);
                        w = Math.max(w, px);
                    });
                    break;
                }
            }
        });
        h = h - y;
        w = w - x;
        return { x, y, h, w };
    }

    clearCanvasArea(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // const { scaleX: a, transformX: e, transformY: f } = this.Board.Transform;
        // const xf = (Math.abs(e) * (a + 1)) / a;
        // const yf = (Math.abs(f) * (a + 1)) / a;
        // ctx.clearRect(-xf, -yf, window.innerWidth / a + xf, window.innerHeight / a + yf);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }

    static getCanvasBoundary(
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        { scaleX: a, transformX: e, transformY: f }: ICanvasTransform,
        size: Size
    ) {
        const xf = (Math.abs(e) * (a + 1)) / a;
        const yf = (Math.abs(f) * (a + 1)) / a;
        return { x: -xf, y: -yf, w: size.width + xf * 2, h: size.height + yf * 2 };
    }

    applyStyles(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, style: IObjectStyle) {
        ctx.save();
        const { fillColor, strokeStyle, strokeWidth, opacity, font } = style;
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = strokeWidth;
        ctx.globalAlpha = opacity / 100;
        ctx.lineCap = "round";
        ctx.font = CanvasHelper.getFont(font, 1);
        if (font) {
            ctx.fillStyle = font.color;
            ctx.textBaseline = "top";
        }
    }

    static getFont(font: Font | null, scale: number) {
        if (font) {
            const { size, family, style: fStyle, varient, weight } = font;
            const aSize = (typeof size === "string" ? Number(size.replace("px", "")) : size) * scale;
            return `${fStyle} ${varient} ${weight} ${aSize}px/${aSize}px ${family} `;
        } else {
            return "";
        }
    }

    static getFontStyle(font: Font | null, scale: number): CSSProperties {
        if (font) {
            const { color } = font;
            return { font: this.getFont(font, scale), color: color };
        } else {
            return {};
        }
    }

    static applySelectedStyle(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        const { a } = ctx.getTransform();
        ctx.save();
        ctx.strokeStyle = "#00ffff";
        ctx.fillStyle = "#00ffff";
        ctx.lineWidth = 0.5 / a;
    }

    static applySelection(
        ctx: CanvasRenderingContext2D,
        { height: h, width: w, x: x, y: y }: Position & Size,
        withGutter = true
    ) {
        const { a } = ctx.getTransform();
        const radius = SELECTOR_POINT_RADIUS / a;
        const gutter = (withGutter ? GUTTER : 0) / a;
        CanvasHelper.applySelectedStyle(ctx);
        const ux = x - gutter;
        const uy = y - gutter;
        const uw = w + gutter * 2;
        const uh = h + gutter * 2;
        ctx.strokeRect(ux, uy, uw, uh);

        ctx.beginPath();
        ctx.moveTo(ux, uy);
        ctx.arc(ux, uy, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(ux, uy + uh);
        ctx.arc(ux, uy + uh, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(ux + uw, uy);
        ctx.arc(ux + uw, uy, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(ux + uw, uy + uh);
        ctx.arc(ux + uw, uy + uh, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.closePath();
        ctx.restore();
    }

    static GetDefaultTransForm() {
        return { ...DEFAULT_TRANSFORM };
    }

    static isCustomElement(ele: BaseObject) {
        return (
            ele.Type === ElementEnum.AiPrompt || ele.Type === ElementEnum.Chart
            // || (ele.Type === ElementEnum.Text && ele.IsSelected)
        );
    }
}
