import { CanvasBoard } from "../../../lib/canvas-board";
import { IElementEventHandler } from "../element-event-handler";
import { CanvasHelper } from "../../../lib/canvas-helpers";

export class TemptSelectionMoveEventHandler implements IElementEventHandler {
    private movingObject = false;

    onMouseDown(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (!board.TempSelectionArea) return;
        board.ActiveObjects = board.SelectedElements;
        board.Elements = board.Elements.filter((e) => CanvasHelper.isCustomElement(e) || !e.IsSelected);
        board.redrawBoard();
        board.TempSelectionArea.move(ctx, { x: 0, y: 0 }, "down", false);
        board.ActiveObjects.forEach((ele) => {
            ele.move(ctx, { x: 0, y: 0 }, "down", false);
        });
    }

    onMouseMove(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (!board.PointerOrigin || !board.TempSelectionArea) return;
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);

        const { x, y } = board.PointerOrigin;

        board.Helper.clearCanvasArea(ctx);
        board.TempSelectionArea.move(ctx, { x: offsetX - x, y: offsetY - y }, "move", false);
        board.ActiveObjects.forEach((ele) => {
            ele.move(ctx, { x: offsetX - x, y: offsetY - y }, "move", false);
        });
    }

    onMouseUp(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (!board.PointerOrigin) return;
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        const { x, y } = board.PointerOrigin;

        board.ActiveObjects.forEach((obj) => {
            obj.move(ctx, { x: offsetX - x, y: offsetY - y }, "up");
        });
        board.SelectedElements = board.ActiveObjects;
        board.saveBoard();
    }
}
