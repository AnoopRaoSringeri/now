import { CanvasBoard } from "../../../lib/canvas-board";
import { CANVAS_SCALING_FACTOR, CANVAS_SCALING_LIMIT, CANVAS_SCALING_MULTIPLIER } from "./../../../lib/canvas-helpers";
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
        if (this.board.HoveredObject) {
            return;
        }
        const oldX = this.board.Transform.transformX;
        const oldY = this.board.Transform.transformY;

        const localX = e.clientX;
        const localY = e.clientY;

        const previousScale = this.board.Transform.scaleX;
        const newScale = Number(Math.abs(this.board.Transform.scaleX + e.deltaY * CANVAS_SCALING_FACTOR).toFixed(4));
        const newX = localX - (localX - oldX) * (newScale / previousScale);
        const newY = localY - (localY - oldY) * (newScale / previousScale);
        if (newScale <= CANVAS_SCALING_LIMIT) {
            const newScale = CANVAS_SCALING_LIMIT;
            const newX = localX - (localX - oldX) * (newScale / previousScale);
            const newY = localY - (localY - oldY) * (newScale / previousScale);
            this.board.Transform = {
                ...this.board.Transform,
                transformX: newX,
                transformY: newY,
                scaleX: newScale,
                scaleY: newScale
            };
            this.board.Zoom = newScale * CANVAS_SCALING_MULTIPLIER;
            return;
        }
        if (isNaN(newX) || isNaN(newY) || !isFinite(newX) || !isFinite(newY)) {
            return;
        }
        this.board.Transform = {
            ...this.board.Transform,
            transformX: newX,
            transformY: newY,
            scaleX: newScale,
            scaleY: newScale
        };
        this.board.Zoom = newScale * CANVAS_SCALING_MULTIPLIER;
        this.board.redrawBoard();
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
