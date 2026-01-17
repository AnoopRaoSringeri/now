import { v4 as uuid } from "uuid";
import { CanvasBoard } from "../../../lib/canvas-board";
import { CanvasHelper } from "../../../lib/canvas-helpers";
import { CanvasActionEnum, ElementEnum } from "../../sketch-now/enums";
import { IElementEventHandler } from "../element-event-handler";
import { Link } from "../objects/link";

export class LinkEventHandler implements IElementEventHandler {
    onMouseDown(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (board.HoveredObject) {
            const newObj = new Link(
                uuid(),
                {
                    type: ElementEnum.Link,
                    value: {
                        start: {
                            ...board.HoveredObject.getValues(),
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
                if (board.CursorPosition === "m") {
                    board._currentCanvasAction = CanvasActionEnum.Move;
                } else {
                    board._currentCanvasAction = CanvasActionEnum.Resize;
                }
                board.CanvasCopy.style.cursor = CanvasHelper.getCursor(board.CursorPosition);
                board.HoveredObject = ele;
            }
        } else {
            if (board.SelectionElement) {
                const hovered =
                    board.Helper.isUnderMouse({ x: offsetX, y: offsetY }, board.SelectionElement.getValues()) ||
                    board.Helper.getCursorPosition({ x: offsetX, y: offsetY }, board.SelectionElement.getValues()) !==
                        "m";
                if (hovered) {
                    board.CursorPosition = board.Helper.getCursorPosition(
                        { x: offsetX, y: offsetY },
                        board.SelectionElement.getValues()
                    );
                    if (board.CursorPosition === "m") {
                        board._currentCanvasAction = CanvasActionEnum.Move;
                    } else {
                        board._currentCanvasAction = CanvasActionEnum.Resize;
                    }
                    board.CanvasCopy.style.cursor = CanvasHelper.getCursor(board.CursorPosition);
                    board.TempSelectionArea = board.SelectionElement;
                } else {
                    board.CursorPosition = null;
                    board._currentCanvasAction = null;
                    board.CanvasCopy.style.cursor = "default";
                    board.TempSelectionArea = null;
                }
            } else {
                const ele = board.Helper.hoveredElement({ x: offsetX, y: offsetY }, board.Elements);
                if (ele) {
                    board.CursorPosition = board.Helper.getCursorPosition({ x: offsetX, y: offsetY }, ele.getValues());
                    if (board.CursorPosition === "m") {
                        board._currentCanvasAction = CanvasActionEnum.Move;
                    } else {
                        board._currentCanvasAction = CanvasActionEnum.Resize;
                    }
                    board.CanvasCopy.style.cursor = CanvasHelper.getCursor(board.CursorPosition);
                    board.HoveredObject = ele;
                } else {
                    board.CursorPosition = null;
                    board._currentCanvasAction = null;
                    board.CanvasCopy.style.cursor = "default";
                    board.HoveredObject = null;
                }
            }
        }
    }

    onMouseUp(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (board.HoveredObject) {
            board.ActiveObjects.forEach((ao) => {
                ao.updateValue(
                    ctx,
                    {
                        ...ao.Value,
                        end: { ...board.HoveredObject!.getValues(), id: board.HoveredObject!.id }
                    },
                    "up"
                );
            });
        }
    }
}
