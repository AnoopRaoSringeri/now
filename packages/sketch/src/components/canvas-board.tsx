import { observer } from "mobx-react";
import { useEffect } from "react";
import { useParams } from "react-router";

import { useResizeObserver } from "@mantine/hooks";
import { AppLoader } from "@now/ui";
import { QueryKeys, useQueryNow, useStore } from "@now/utils";
import { useCanvas } from "../hooks/use-canvas";
import { ImageInput } from "../mini-components/image-input";
import { TextEditorWrapper } from "../mini-components/text-editor";
import { CustomComponentsRenderer } from "../renderers/custom-component-renderer";
import CanvasOptions from "./canvas-options";

export const CanvasBoard = observer(function CanvasBoard() {
    const [resizer, rect] = useResizeObserver();
    const { id } = useParams<{ id: string }>();
    const { canvasBoard, onResize } = useCanvas(id ?? "new");
    const { sketchStore } = useStore();
    const canvas = canvasBoard.CanvasRef;

    const { data, isLoading: sketchLoading } = useQueryNow({
        queryFn: async () => {
            if (id && id !== "new") {
                return await sketchStore.GetSketchById(id);
            } else {
                return null;
            }
        },
        queryKey: [QueryKeys.Sketch, id ?? "new"]
    });

    useEffect(() => {
        onResize();
    }, [onResize, rect]);

    useEffect(() => {
        if (id && id !== "new" && data) {
            canvasBoard.loadBoard(data.metadata, {
                draw: true,
                height: window.innerHeight,
                width: window.innerWidth,
                readonly: false
            });
            canvasBoard.UiStateManager.BoardName = data.name;
        } else {
            canvasBoard.createBoard({});
        }
    }, [canvas, canvasBoard, data, id]);

    return (
        <div className="size-full">
            <div className="size-full absolute z-0" ref={resizer} />
            <AppLoader loading={sketchLoading} />
            <CanvasOptions />
            <TextEditorWrapper />
            <ImageInput />
            <div ref={canvasBoard.UiStateManager.BoardContainerRef} className="size-full">
                <CustomComponentsRenderer />
                <canvas
                    id="canvas-board"
                    className="absolute z-1 overscroll-none"
                    ref={canvasBoard.CanvasRef}
                ></canvas>
                <canvas
                    id="canvas-board-copy"
                    className="absolute z-2 overscroll-none"
                    ref={canvasBoard.CanvasCopyRef}
                ></canvas>
            </div>
        </div>
    );
});
