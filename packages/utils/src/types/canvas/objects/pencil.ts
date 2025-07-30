import { BaseObject } from "../base-object";
import { PencilObject, PointsArray } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";
import getStroke, { StrokeOptions } from "perfect-freehand";
import { CursorPosition, MouseAction } from "../../sketch-now/custom-canvas";
import { runInAction, toJS } from "mobx";
import { Delta, Position } from "../../sketch-now/canvas";
import { IObjectStyle } from "../../sketch-now/object-styles";

const options: StrokeOptions = {
    smoothing: 0.01,
    thinning: 0,
    streamline: 0.99,
    simulatePressure: false,
    easing: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
};
const average = (a: number, b: number) => (a + b) / 2;
function getSvgPathFromStroke(points: number[][], closed = true) {
    const len = points.length;

    if (len < 4) {
        return ``;
    }

    let a = points[0];
    let b = points[1];
    const c = points[2];

    let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(2)},${b[1].toFixed(2)} ${average(
        b[0],
        c[0]
    ).toFixed(2)},${average(b[1], c[1]).toFixed(2)} T`;

    for (let i = 2, max = len - 1; i < max; i++) {
        a = points[i];
        b = points[i + 1];
        result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(2)} `;
    }

    if (closed) {
        result += "Z";
    }
    return result;
}

export class Pencil extends BaseObject {
    private tmpPoints: [number, number][] = [];
    object: PencilObject;
    constructor(id: string, object: PencilObject, board: CanvasBoard, style: IObjectStyle) {
        super(id, object, board, style);
        this.object = object;
    }

    get Value() {
        return toJS(this.object.value);
    }

    get Points() {
        return this.Value.points;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        this.Board.Helper.applyStyles(ctx, this.style);
        const stroke = getStroke(this.Points, {
            size: this.style.strokeWidth,
            ...options
        });
        const pathData = getSvgPathFromStroke(stroke);
        const myPath = new Path2D(pathData);
        ctx.stroke(myPath);
        ctx.fill(myPath);
        ctx.restore();
        if (this.IsSelected) {
            this.select({});
        }
    }

    create(ctx: CanvasRenderingContext2D) {
        this.Board.Helper.applyStyles(ctx, this.style);
        this.draw(ctx);
    }

    updateValue(ctx: CanvasRenderingContext2D, objectValue: PointsArray, action: MouseAction, clearCanvas = true) {
        runInAction(() => {
            const { points = [] } = objectValue;
            if (points.length === 0) {
                return;
            }
            this.Board.Helper.applyStyles(ctx, this.style);
            if (clearCanvas) {
                this.Board.Helper.clearCanvasArea(ctx);
            }
            const [x, y] = points[0];
            const [prevX, prevY] = this.Points[this.Points.length - 1];
            if (prevX !== x || prevY !== y) {
                this.object.value.points.push([x, y]);
            }
            const stroke = getStroke(this.Points, {
                size: this.style.strokeWidth,
                ...options
            });
            const pathData = getSvgPathFromStroke(stroke);
            const myPath = new Path2D(pathData);
            ctx.stroke(myPath);
            ctx.fill(myPath);
            ctx.restore();
        });
    }

    move(ctx: CanvasRenderingContext2D, position: Position, action: MouseAction, clearCanvas = true): void {
        runInAction(() => {
            const { x, y } = position;
            this.Board.Helper.applyStyles(ctx, this.style);
            if (clearCanvas) {
                this.Board.Helper.clearCanvasArea(ctx);
            }
            if (action === "down") {
                this.tmpPoints = this.Points;
            }
            const points: [number, number][] = this.tmpPoints.map((p) => {
                const [px, py] = p;
                const offsetX = x + px;
                const offsetY = y + py;
                return [offsetX, offsetY];
            });
            const stroke = getStroke(points, {
                size: this.style.strokeWidth,
                ...options
            });
            const pathData = getSvgPathFromStroke(stroke);
            const myPath = new Path2D(pathData);
            ctx.stroke(myPath);
            ctx.fill(myPath);
            ctx.restore();

            this.select({});
            this.object.value.points = this.tmpPoints.map((p) => {
                const [px, py] = p;
                const offsetX = x + px;
                const offsetY = y + py;
                return [offsetX, offsetY];
            });

            if (action === "up") {
                this.tmpPoints = [];
                this.IsDragging = false;
            }
        });
    }

    resize(ctx: CanvasRenderingContext2D, delta: Delta, cPos: CursorPosition, action: MouseAction, clearCanvas = true) {
        return runInAction(() => {
            const { dx, dy } = delta;
            this.Board.Helper.applyStyles(ctx, this.style);
            if (clearCanvas) {
                this.Board.Helper.clearCanvasArea(ctx);
            }
            this.IsDragging = true;
            this.object.value.points = this.Points.map((p) => {
                const [px, py] = p;
                const offsetX = dx + px;
                const offsetY = dy + py;
                return [offsetX, offsetY];
            });

            const stroke = getStroke(this.Points, {
                size: this.style.strokeWidth,
                ...options
            });
            const pathData = getSvgPathFromStroke(stroke);
            const myPath = new Path2D(pathData);
            ctx.stroke(myPath);
            ctx.fill(myPath);
            ctx.restore();

            this.select({});
            return { x: 0, y: 0, h: 0, w: 0 };
        });
    }

    getValues(): PencilObject {
        return this.object;
    }
}
