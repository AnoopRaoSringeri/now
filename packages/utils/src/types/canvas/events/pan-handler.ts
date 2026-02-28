import { CanvasBoard } from "../../../lib/canvas-board";
import { IElementEventHandler } from "../element-event-handler";
import { CanvasActionEnum } from "../../sketch-now/enums";

export class PanEventHandler implements IElementEventHandler {
    onMouseDown(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        board._currentCanvasAction = CanvasActionEnum.Pan;
        board.PointerOrigin = { x: e.offsetX, y: e.offsetY };
        board.CanvasCopy.style.cursor = "grab";
    }

    onMouseMove(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (!board.PointerOrigin) return;
        board.CanvasCopy.style.cursor = "grabbing";
        const { x, y } = board.PointerOrigin;
        const { offsetX, offsetY } = e;
        const dx = offsetX - x;
        const dy = offsetY - y;
        board.Transform = {
            ...board.Transform,
            transformX: board.Transform.transformX + dx,
            transformY: board.Transform.transformY + dy
        };
        board.PointerOrigin = { x: offsetX, y: offsetY };
        board.redrawBoard();
    }

    onMouseUp(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        board._currentCanvasAction = null;
        board.PointerOrigin = null;
        board.CanvasCopy.style.cursor = "default";
    }
}
