import { CanvasBoard } from "../../../lib/canvas-board";
import { IElementEventHandler } from "../element-event-handler";
import { CanvasHelper } from "../../../lib/canvas-helpers";
import { CanvasActionEnum, ElementEnum } from "../../sketch-now/enums";

export class TempSelectionResizeEventHandler implements IElementEventHandler {
    onMouseDown(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (!board.TempSelectionArea || !board.HoveredObject) return;
        board._currentCanvasAction = CanvasActionEnum.SelectionResize;
        board.ActiveObjects = [board.HoveredObject];
        board.SelectedElements = [board.HoveredObject];
        board.ActiveObjects = board.SelectedElements;
        board.SelectedElements = [];
        board.Elements = board.Elements.filter((e) => CanvasHelper.isCustomElement(e) || !e.IsSelected);
        board.redrawBoard();
        board.TempSelectionArea.resize(ctx, { dx: 0, dy: 0 }, board.CursorPosition!, "down", false);
        board.ActiveObjects.forEach((ele) => {
            ele.updateValue(ctx, ele.Value, "down", false);
        });
    }

    onMouseMove(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (!board.PointerOrigin || !board.TempSelectionArea) return;
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);

        const { x, y } = board.PointerOrigin;
        board.Helper.clearCanvasArea(ctx);
        const { x: px = 0, y: py = 0, h: ph = 0, w: pw = 0 } = board.TempSelectionArea.Value;
        const {
            x: rx = 0,
            y: ry = 0,
            h: rh = 0,
            w: rw = 0
        } = board.TempSelectionArea.resize(
            ctx,
            { dx: offsetX - x, dy: offsetY - y },
            board.CursorPosition!,
            "move",
            false
        );
        const cp = board.Helper.getCursorPosition({ x: offsetX, y: offsetY }, board.TempSelectionArea.getValues());
        board.ActiveObjects.forEach((ele) => {
            const { type, value } = ele.getValues();
            switch (type) {
                case ElementEnum.AiPrompt:
                case ElementEnum.Chart:
                case ElementEnum.Image:
                case ElementEnum.Rectangle: {
                    const { x: ex = 0, y: ey = 0, h: eh = 0, w: ew = 0 } = value;
                    const uh = (eh * rh) / ph;
                    const uw = (ew * rw) / pw;
                    let ox = 0;
                    let oy = 0;
                    let ux = 0;
                    let uy = 0;
                    switch (cp) {
                        case "br":
                            ox = ((ex - rx) * rw) / pw;
                            oy = ((ey - ry) * rh) / ph;
                            ux = px + ox;
                            uy = py + oy;
                            break;
                        case "tr":
                        case "tl":
                        case "bl":
                            ox = ((ex - px) * rw) / pw;
                            oy = ((ey - py) * rh) / ph;
                            ux = rx + ox;
                            uy = ry + oy;
                    }
                    // if (ele.type === ElementEnum.Pencil) {
                    //     ele.resize(ctx, { dx: ox, dy: oy }, "m", "move", false);
                    // } else {
                    //     ele.update(ctx, { h: uh, w: uw, x: ux, y: uy, points: [] }, "move", false);
                    // }
                    ele.updateValue(ctx, { h: uh, w: uw, x: ux, y: uy }, "move", false);
                    break;
                }
                default:
                    ele.updateValue(ctx, { ...ele.Value, points: [[offsetX, offsetY]] }, "move", false);
            }
        });
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
