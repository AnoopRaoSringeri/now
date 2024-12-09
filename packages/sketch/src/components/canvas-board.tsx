import { observer } from "mobx-react";
import { useEffect } from "react";
import { useParams } from "react-router";

import { ImageInput } from "../mini-components/image-input";
import { TablesRenderer } from "../mini-components/tables-renderer";
import { TextEditorWrapper } from "../mini-components/text-editor";
import CanvasOptions from "./canvas-options";
import { useCanvas } from "../hooks/use-canvas";
import { AppLoader } from "@now/ui";

export const CanvasBoard = observer(function CanvasBoard() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");
    const canvas = canvasBoard.CanvasRef;

    useEffect(() => {
        canvasBoard.createBoard({});
    }, [canvas]);

    return (
        <>
            {/* <AppLoader /> */}
            <CanvasOptions name={""} />
            <TextEditorWrapper />
            <ImageInput />
            <TablesRenderer />
            <canvas id="canvas-board" className="absolute z-10 overscroll-none" ref={canvasBoard.CanvasRef}></canvas>
            <canvas
                id="canvas-board-copy"
                className="absolute z-20 overscroll-none"
                ref={canvasBoard.CanvasCopyRef}
            ></canvas>
        </>
    );
});
