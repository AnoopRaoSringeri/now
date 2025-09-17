import { v4 as uuid } from "uuid";
import { IElementEventHandler } from "../element-event-handler";
import { CanvasBoard } from "../../../lib/canvas-board";
import { CanvasHelper } from "../../../lib/canvas-helpers";
import { CanvasImage } from "../objects/image";
import { ElementEnum } from "../../sketch-now/enums";

export class ImageEventHandler implements IElementEventHandler {
    onMouseDown(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);

        // Create new placeholder image
        const image = new CanvasImage(
            uuid(),
            {
                type: ElementEnum.Image,
                value: { x: offsetX, y: offsetY, w: 0, h: 0, value: "" }
            },
            board,
            board.Style
        );

        image.create(ctx);

        // board.ActiveObjects = [image];
        board.Image = image; // stored for async upload usage
    }

    onMouseMove(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        // if (!board.PointerOrigin || board.ActiveObjects.length === 0) return;
        // const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        // const { x, y } = board.PointerOrigin;
        // const img = board.ActiveObjects[0] as CanvasImage;
        // img.updateValue(ctx, { ...img.Value, w: offsetX - x, h: offsetY - y }, "move");
    }

    onMouseUp(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        // if (!board.PointerOrigin || board.ActiveObjects.length === 0) return;
        // const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        // const { x, y } = board.PointerOrigin;
        // const img = board.ActiveObjects[0] as CanvasImage;
        // img.updateValue(ctx, { ...img.Value, w: offsetX - x, h: offsetY - y }, "up");
        // board.saveBoard();
    }
}
