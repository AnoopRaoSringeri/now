import { v4 as uuid } from "uuid";
import { CanvasBoard } from "../../../lib/canvas-board";
import { CanvasHelper } from "../../../lib/canvas-helpers";
import { ElementEnum } from "../../sketch-now/enums";
import { IElementEventHandler } from "../element-event-handler";
import { Link } from "../objects/link";

export class LinkEventHandler implements IElementEventHandler {
    onMouseDown(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (board.HoveredObject) {
            const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
            const newObj = new Link(
                uuid(),
                {
                    type: ElementEnum.Link,
                    value: {
                        start: {
                            x: offsetX,
                            y: offsetY,
                            id: board.HoveredObject.id
                        },
                        end: null
                    }
                },
                board,
                board.Style
            );
            board.ActiveObjects.push(newObj);
        }
    }

    onMouseMove(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        if (board.ActiveObjects.length > 0) {
            const ele = board.Helper.hoveredElement({ x: offsetX, y: offsetY }, board.Elements);
            if (ele) {
                board.CursorPosition = board.Helper.getCursorPosition({ x: offsetX, y: offsetY }, ele.getValues());
                board.CanvasCopy.style.cursor = "grabbing";
                board.HoveredObject = ele;
            }
        } else {
            const ele = board.Helper.hoveredElement({ x: offsetX, y: offsetY }, board.Elements);
            if (ele) {
                board.CursorPosition = board.Helper.getCursorPosition({ x: offsetX, y: offsetY }, ele.getValues());
                board.CanvasCopy.style.cursor = "grab";
                board.HoveredObject = ele;
            } else {
                board.CursorPosition = null;
                board._currentCanvasAction = null;
                board.CanvasCopy.style.cursor = "default";
                board.HoveredObject = null;
            }
        }
    }

    onMouseUp(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (board.HoveredObject) {
            const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
            board.ActiveObjects.forEach((ao) => {
                ao.updateValue(
                    ctx,
                    {
                        ...ao.Value,
                        end: { x: offsetX, y: offsetY, id: board.HoveredObject!.id }
                    },
                    "up"
                );
            });
            board.saveBoard();
        }
    }
}
