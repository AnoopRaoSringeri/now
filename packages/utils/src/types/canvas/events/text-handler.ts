import { IElementEventHandler } from "../element-event-handler";
import { CanvasBoard } from "../../../lib/canvas-board";
import { CanvasHelper } from "../../../lib/canvas-helpers";
import { Text } from "../objects/text";
import { v4 as uuid } from "uuid";
import { ElementEnum } from "../../sketch-now/enums";
export class TextEventHandler implements IElementEventHandler {
    private isEditing = false;

    onMouseDown(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);

        // Double click → enter edit mode
        if (e.detail === 2 && board.HoveredObject instanceof Text) {
            board.Text = board.HoveredObject;
            this.isEditing = true;
            return;
        }

        // Create new text object
        if (!board.Text) {
            const text = new Text(
                uuid(),
                {
                    type: ElementEnum.Text,
                    value: { x: offsetX, y: offsetY, w: 0, h: 0, value: "" }
                },
                board,
                board.Style
            );
            text.create(ctx);
            board.Text = text;
            board.ActiveObjects = [text];
            board.PointerOrigin = { x: offsetX, y: offsetY };
            this.isEditing = true;
        }
    }

    onMouseMove(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        // allow resizing the text box while creating
        if (!board.Text || !board.PointerOrigin || this.isEditing) return;
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        const { x, y } = board.PointerOrigin;

        board.Text.updateValue(ctx, { ...board.Text.Value, w: offsetX - x, h: offsetY - y }, "move");
    }

    onMouseUp(e: MouseEvent, board: CanvasBoard, ctx: CanvasRenderingContext2D) {
        if (!board.Text || !board.PointerOrigin || this.isEditing) return;
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, board.Transform);
        const { x, y } = board.PointerOrigin;

        board.Text.updateValue(ctx, { ...board.Text.Value, w: offsetX - x, h: offsetY - y }, "up");
        board.saveBoard();
    }

    // 🔹 Handle typing inside EventManager flow
    onKeyDown(e: KeyboardEvent, board: CanvasBoard) {
        if (!this.isEditing || !board.Text) return;

        if (e.key === "Enter") {
            // finish editing
            board.updateText(board.Text.Value.value);
            this.isEditing = false;
            return;
        }
        if (e.key === "Backspace") {
            const newValue = board.Text.Value.value.slice(0, -1);
            board.updateText(newValue);
            return;
        }
        if (e.key.length === 1) {
            // add normal characters
            const newValue = board.Text.Value.value + e.key;
            board.updateText(newValue);
        }
    }
}
