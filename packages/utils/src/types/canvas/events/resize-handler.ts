import { CanvasBoard } from "../../../lib/canvas-board";
import { IElementEventHandler } from "../element-event-handler";
import { CanvasHelper } from "../../../lib/canvas-helpers";
import { CanvasActionEnum } from "../../sketch-now/enums";

export class ResizeEventHandler implements IElementEventHandler {
    onMouseDown(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        board._currentCanvasAction = CanvasActionEnum.Resize;
        if (board.HoveredObject) {
            board.ActiveObjects = [board.HoveredObject];
            board.SelectedElements = [board.HoveredObject];
        }
        board.ActiveObjects.forEach((ao) => {
            ao.resize(ctx, { dx: 0, dy: 0 }, board.CursorPosition!, "down");
        });
    }

    onMouseMove(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        if (!board.PointerOrigin) return;

        const { x, y } = board.PointerOrigin;
        if (board.ActiveObjects.length > 0 && board.CursorPosition) {
            board.SelectedElements = [];
            board.Helper.clearCanvasArea(ctx);
            board.ActiveObjects.forEach((obj) => {
                obj.resize(ctx, { dx: offsetX - x, dy: offsetY - y }, board.CursorPosition!, "move");
            });
            board.redrawBoard();
        }
    }

    onMouseUp(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (!board.PointerOrigin) return;
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        const { x, y } = board.PointerOrigin;

        if (board.ActiveObjects.length > 0 && board.CursorPosition) {
            board.ActiveObjects.forEach((obj) => {
                obj.resize(ctx, { dx: offsetX - x, dy: offsetY - y }, board.CursorPosition!, "up");
            });
            board.saveBoard();
        }
        ctx.closePath();
    }
}
