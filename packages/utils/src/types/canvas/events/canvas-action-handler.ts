import { PanEventHandler } from "./pan-handler";
import { CanvasBoard } from "../../../lib/canvas-board";
import { IElementEventHandler } from "../element-event-handler";
import {
    CANVAS_SCALING_FACTOR,
    CANVAS_SCALING_LIMIT,
    CANVAS_SCALING_MULTIPLIER,
    CanvasHelper
} from "../../../lib/canvas-helpers";
import { CanvasActionEnum } from "../../sketch-now/enums";
import { MoveEventHandler } from "./move-handler";
import { ResizeEventHandler } from "./resize-handler";
import { SelectionAreaHandler } from "./selection-area-handler";
import { TemptSelectionMoveEventHandler as TempSelectionMoveEventHandler } from "./temp-selection-move-handler";
import { TempSelectionResizeEventHandler } from "./temp-selection-resize-handler";

export class CanvasActionHandler implements IElementEventHandler {
    private canvasActionHandlers: Map<CanvasActionEnum, IElementEventHandler> = new Map();
    constructor() {
        this.canvasActionHandlers.set(CanvasActionEnum.SelectionArea, new SelectionAreaHandler());
        this.canvasActionHandlers.set(CanvasActionEnum.Move, new MoveEventHandler());
        this.canvasActionHandlers.set(CanvasActionEnum.Resize, new ResizeEventHandler());
        this.canvasActionHandlers.set(CanvasActionEnum.Pan, new PanEventHandler());
        this.canvasActionHandlers.set(CanvasActionEnum.SelectionMove, new TempSelectionMoveEventHandler());
        this.canvasActionHandlers.set(CanvasActionEnum.SelectionResize, new TempSelectionResizeEventHandler());
    }
    getHandler(type: CanvasActionEnum): IElementEventHandler | undefined {
        return this.canvasActionHandlers.get(type);
    }

    onMouseDown(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (!ctx) return;
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        board.PointerOrigin = { x: offsetX, y: offsetY };
        if (board.CursorPosition == null) {
            board.unSelectElements();
        }

        if (e.detail === 1 && e.ctrlKey) {
            board._currentCanvasAction = CanvasActionEnum.Pan;
        } else if (board.SelectionElement) {
            if (board.CursorPosition === "m") {
                board._currentCanvasAction = CanvasActionEnum.SelectionMove;
            } else {
                board._currentCanvasAction = CanvasActionEnum.SelectionResize;
            }
        } else if (board.HoveredObject) {
            board.Elements = board.Elements.filter(
                (e) => CanvasHelper.isCustomElement(e) || e.id !== board.HoveredObject!.id
            );
            board.redrawBoard();
            if (board.CursorPosition === "m") {
                board._currentCanvasAction = CanvasActionEnum.Move;
            } else {
                board._currentCanvasAction = CanvasActionEnum.Resize;
            }
        } else {
            board._currentCanvasAction = CanvasActionEnum.SelectionArea;
        }
        if (board._currentCanvasAction) {
            this.getHandler(board._currentCanvasAction)?.onMouseDown(e, board, ctx);
        }
    }

    onMouseMove(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (board._currentCanvasAction) {
            this.getHandler(board._currentCanvasAction)?.onMouseMove(e, board, ctx);
        } else if (board.SelectionElement) {
            const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
            const hovered =
                board.Helper.isUnderMouse({ x: offsetX, y: offsetY }, board.SelectionElement.getValues()) ||
                board.Helper.getCursorPosition({ x: offsetX, y: offsetY }, board.SelectionElement.getValues()) !== "m";
            if (hovered) {
                board.CursorPosition = board.Helper.getCursorPosition(
                    { x: offsetX, y: offsetY },
                    board.SelectionElement.getValues()
                );
                board.CanvasCopy.style.cursor = CanvasHelper.getCursor(board.CursorPosition);
                board.TempSelectionArea = board.SelectionElement;
            } else {
                board.CursorPosition = null;
                board._currentCanvasAction = null;
                board.CanvasCopy.style.cursor = "default";
                board.TempSelectionArea = null;
                board._currentCanvasAction = null;
            }
        } else {
            const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
            const hover = board.Helper.hoveredElement({ x: offsetX, y: offsetY }, board.Elements);
            if (hover) {
                board.HoveredObject = hover;
                const cursorPos = board.Helper.getCursorPosition({ x: offsetX, y: offsetY }, hover.getValues());
                board.CursorPosition = cursorPos;
                board.CanvasCopy.style.cursor = CanvasHelper.getCursor(cursorPos);
            } else {
                board.HoveredObject = null;
                board.CursorPosition = null;
                board.CanvasCopy.style.cursor = "default";
                board._currentCanvasAction = null;
            }
        }
    }

    onMouseUp(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (board._currentCanvasAction) {
            this.getHandler(board._currentCanvasAction)?.onMouseUp(e, board, ctx);
        }
        board.PointerOrigin = null;
        board._currentCanvasAction = null;
        ctx.closePath();
    }

    onWheelAction(e: WheelEvent, board: CanvasBoard) {
        const oldX = board.Transform.transformX;
        const oldY = board.Transform.transformY;

        const localX = e.clientX;
        const localY = e.clientY;

        const prevScale = board.Transform.scaleX;
        const newScale = Number(Math.abs(prevScale + e.deltaY * CANVAS_SCALING_FACTOR).toFixed(4));

        if (newScale <= CANVAS_SCALING_LIMIT) return;

        const newX = localX - (localX - oldX) * (newScale / prevScale);
        const newY = localY - (localY - oldY) * (newScale / prevScale);

        if (!isFinite(newX) || !isFinite(newY)) return;

        board.Transform = {
            ...board.Transform,
            transformX: newX,
            transformY: newY,
            scaleX: newScale,
            scaleY: newScale
        };
        board.Zoom = newScale * CANVAS_SCALING_MULTIPLIER;
        board.redrawBoard();
    }
}
