import { CanvasBoard } from "../../lib/canvas-board";

export interface IElementEventHandler {
    onMouseDown(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D): void;
    onMouseMove(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D): void;
    onMouseUp(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D): void;
}
