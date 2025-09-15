import { CanvasBoard } from "../../../lib/canvas-board";
import { IElementEventHandler } from "../element-event-handler";
import {
    CANVAS_SCALING_FACTOR,
    CANVAS_SCALING_LIMIT,
    CANVAS_SCALING_MULTIPLIER,
    CanvasHelper,
    SelectionStyle
} from "../../../lib/canvas-helpers";
import { CanvasActionEnum, ElementEnum } from "../../sketch-now/enums";
import { Rectangle } from "../objects/rectangle";

export class SelectionAreaHandler implements IElementEventHandler {
    onMouseDown(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        board._currentCanvasAction = CanvasActionEnum.SelectionArea;
        board.TempSelectionArea = new Rectangle(
            "temp-selection",
            {
                type: ElementEnum.Rectangle,
                value: { x: offsetX, y: offsetY, w: 0, h: 0 }
            },
            board,
            board.Style
        );
        board.TempSelectionArea.Style = SelectionStyle;
        board.TempSelectionArea.create(ctx);
    }

    onMouseMove(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);

        if (!board.PointerOrigin) return;

        const { x, y } = board.PointerOrigin;
        if (board.TempSelectionArea) {
            board.TempSelectionArea.updateValue(
                ctx,
                {
                    ...board.TempSelectionArea.Value,
                    w: offsetX - x,
                    h: offsetY - y
                },
                "move"
            );
        }
    }

    onMouseUp(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (!board.TempSelectionArea || !board.PointerOrigin) return;
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);

        const { x, y } = board.PointerOrigin;
        board.TempSelectionArea.updateValue(
            ctx,
            {
                ...board.TempSelectionArea.Value,
                w: offsetX - x,
                h: offsetY - y
            },
            "up"
        );
        const { h = 0, w = 0, x: sx = 0, y: sy = 0 } = board.TempSelectionArea.Value;
        board.SelectedElements = CanvasHelper.getElementsInsideArea(
            { height: h, width: w, x: sx, y: sy },
            board.Elements
        );

        if (board.SelectedElements.length > 0) {
            const selectedBounds = CanvasHelper.getSelectedAreaBoundary(board.SelectedElements);
            board.TempSelectionArea.updateValue(ctx, selectedBounds, "up");
            board.TempSelectionArea.draw(ctx);
            board.SelectionElement = board.TempSelectionArea;
        } else {
            board.unSelectElements();
        }
        board.TempSelectionArea = null;
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
