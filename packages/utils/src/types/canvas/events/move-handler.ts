import { CanvasBoard } from "../../../lib/canvas-board";
import { IElementEventHandler } from "../element-event-handler";
import {
    CANVAS_SCALING_FACTOR,
    CANVAS_SCALING_LIMIT,
    CANVAS_SCALING_MULTIPLIER,
    CanvasHelper
} from "../../../lib/canvas-helpers";
import { CanvasActionEnum } from "../../sketch-now/enums";

export class MoveEventHandler implements IElementEventHandler {
    onMouseDown(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        board._currentCanvasAction = CanvasActionEnum.Move;
        if (board.HoveredObject) {
            board.ActiveObjects = [board.HoveredObject];
            board.SelectedElements = [board.HoveredObject];
        }
        board.ActiveObjects.forEach((ao) => {
            ao.move(ctx, { x: 0, y: 0 }, "down");
            ao.ShowSelection = true;
        });
    }

    onMouseMove(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);

        if (!board.PointerOrigin) return;

        const { x, y } = board.PointerOrigin;

        if (board.ActiveObjects.length > 0) {
            board.SelectedElements = [];
            board.Helper.clearCanvasArea(ctx);
            board.ActiveObjects.forEach((obj) => {
                obj.move(ctx, { x: offsetX - x, y: offsetY - y }, "move");
            });
            board.redrawBoard();
        } else if (!board.HoveredObject) {
            board._currentCanvasAction = null;
        }
    }

    onMouseUp(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (!board.CanvasCopy) {
            return;
        }
        if (!board.PointerOrigin) return;
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        const { x, y } = board.PointerOrigin;

        board.ActiveObjects.forEach((obj) => {
            obj.move(ctx, { x: offsetX - x, y: offsetY - y }, "up");
        });
        board.SelectedElements = board.ActiveObjects;
        board.saveBoard();
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
