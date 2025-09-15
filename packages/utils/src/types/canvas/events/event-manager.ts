import { CanvasBoard } from "../../../lib/canvas-board";
import { EventHandlerRegistry } from "./event-handler-registry";

export class EventManager {
    private readonly board: CanvasBoard;
    private readonly registry: EventHandlerRegistry;

    constructor(board: CanvasBoard) {
        this.board = board;
        this.registry = new EventHandlerRegistry();
    }

    private get ctx(): CanvasRenderingContext2D | null {
        return this.board.CanvasCopy?.getContext("2d") ?? null;
    }

    onMouseDown(e: MouseEvent) {
        if (this.board.Clicked) {
            return;
        }
        this.board.Clicked = true;
        if (!this.ctx) return;
        this.registry.getHandler(this.board.ElementType)?.onMouseDown(e, this.board, this.ctx);
    }

    onMouseMove(e: MouseEvent) {
        if (!this.ctx) return;
        this.registry.getHandler(this.board.ElementType)?.onMouseMove(e, this.board, this.ctx);
    }

    onMouseUp(e: MouseEvent) {
        if (!this.board.Clicked) {
            return;
        }
        this.board.Clicked = false;
        if (!this.ctx) return;
        this.registry.getHandler(this.board.ElementType)?.onMouseUp(e, this.board, this.ctx);
    }

    // keep wheel/touch handling here
    onWheelAction(e: WheelEvent) {
        // implement pan/zoom
    }

    onTouchStart(e: TouchEvent) {
        //
    }
    onTouchMove(e: TouchEvent) {
        //
    }
    onTouchEnd(e: TouchEvent) {
        //
    }
}
