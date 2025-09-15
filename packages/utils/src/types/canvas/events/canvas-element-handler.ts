import { CanvasObjectFactory } from "./../../../lib/canvas-object-factory";
import { IElementEventHandler } from "../element-event-handler";
import { CanvasBoard } from "../../../lib/canvas-board";
import { CanvasHelper } from "../../../lib/canvas-helpers";

export class CanvasElementHandler implements IElementEventHandler {
    onMouseDown(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        board.PointerOrigin = { x: offsetX, y: offsetY };

        const newObj = CanvasObjectFactory.createNewObject(
            board.ElementType,
            {
                x: offsetX,
                y: offsetY
            },
            board
        );
        newObj.create(ctx);
        board.ActiveObjects.push(newObj);
    }

    onMouseMove(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (!board.PointerOrigin) return;
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        board.CurrentPointer = {
            x: offsetX,
            y: offsetY
        };
        const { x, y } = board.PointerOrigin;

        board.ActiveObjects.forEach((ao) => {
            ao.updateValue(
                ctx,
                {
                    ...ao.Value,
                    w: offsetX - x,
                    h: offsetY - y,
                    ex: offsetX,
                    ey: offsetY,
                    points: [[offsetX, offsetY]]
                },
                "move"
            );
        });
    }

    onMouseUp(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (!board.PointerOrigin || board.ActiveObjects.length === 0) return;
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        const { x, y } = board.PointerOrigin;

        board.ActiveObjects.forEach((ao) => {
            ao.updateValue(
                ctx,
                {
                    ...ao.Value,
                    w: offsetX - x,
                    h: offsetY - y,
                    points: [[offsetX, offsetY]]
                },
                "up"
            );
        });
        board.saveBoard();
    }
}
