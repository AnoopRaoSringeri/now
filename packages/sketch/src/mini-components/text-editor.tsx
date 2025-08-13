import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useCanvas } from "../hooks/use-canvas";
import { CanvasHelper, DefaultFont } from "@now/utils";

export const TextEditorWrapper = observer(function TextEditorWrapper() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.value = canvasBoard.Text?.Value.value ?? "";
            autoResize();
        }
    }, [canvasBoard.Text != null]);

    useEffect(() => {
        inputRef.current?.addEventListener("input", autoResize, false);
        return () => {
            inputRef.current?.removeEventListener("input", autoResize, false);
        };
    }, [canvasBoard.Text != null]);

    function onBlur(value: string) {
        canvasBoard.updateText(value);
    }

    function autoResize() {
        if (!inputRef.current) {
            return;
        }
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = inputRef.current.scrollHeight + "px";
        inputRef.current.style.width = "auto";
        inputRef.current.style.width = inputRef.current.scrollWidth + "px";
    }

    if (canvasBoard.Text == null) {
        return null;
    }

    const { x = 0, y = 0 } = canvasBoard.Text.Value;

    const { ax, ay } = CanvasHelper.getAbsolutePosition({ x, y }, canvasBoard.Transform);
    const { font, ...rest } = canvasBoard.Text.Style;
    const dFont = font ?? DefaultFont();

    return (
        <div className="absolute z-[5] flex size-full overflow-hidden bg-transparent">
            <textarea
                ref={inputRef}
                id="canvas-text"
                className="absolute  m-0 block resize-none overflow-hidden whitespace-pre border-none bg-transparent p-0 outline-none focus:border-none focus:ring-0 focus:ring-offset-0 focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                style={{
                    top: ay - 2,
                    left: ax,
                    ...CanvasHelper.getFontStyle(dFont, canvasBoard.Transform.scaleX),
                    ...rest
                }}
                onBlur={(e) => onBlur(e.target.value)}
            />
        </div>
    );
});
