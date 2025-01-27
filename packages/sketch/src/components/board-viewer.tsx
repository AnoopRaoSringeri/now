import { observer } from "mobx-react";
import { useEffect } from "react";
import { useParams } from "react-router";

import { useCanvas } from "../hooks/use-canvas";
import { AppLoader, useSidebar } from "@now/ui";
import { QueryKeys, useQueryNow, useStore } from "@now/utils";
import { useFullscreen, useResizeObserver } from "@mantine/hooks";
import { CustomComponentsRenderer } from "../renderers/custom-component-renderer";

export const BoardViewer = observer(function BoardViewer() {
    const { setOpen } = useSidebar();
    const { ref } = useFullscreen();
    const [resizer, rect] = useResizeObserver();
    const { id } = useParams<{ id: string }>();
    const { canvasBoard, onResize } = useCanvas(id ?? "new");
    const { sketchStore } = useStore();
    const canvas = canvasBoard.CanvasRef;

    const { data, isLoading: sketchLoading } = useQueryNow({
        queryFn: async () => {
            if (id) {
                return await sketchStore.GetSketchById(id);
            } else {
                return null;
            }
        },
        queryKey: [QueryKeys.Sketch, id ?? 0]
    });

    useEffect(() => {
        onResize();
    }, [rect]);

    useEffect(() => {
        setOpen(false);
        return () => {
            setOpen(true);
        };
    }, []);

    useEffect(() => {
        if (id && id !== "new" && data) {
            canvasBoard.loadBoard(data.metadata, {
                draw: true,
                height: window.innerHeight,
                width: window.innerWidth,
                readonly: true
            });
        } else {
            canvasBoard.createBoard({});
        }
    }, [canvas, canvasBoard, data, id]);

    return (
        <div ref={ref} className="size-full">
            <div className="size-full absolute z-0" ref={resizer} />
            <AppLoader loading={sketchLoading} />
            <CustomComponentsRenderer />
            <canvas id="canvas-board" className="absolute z-[1] overscroll-none" ref={canvasBoard.CanvasRef}></canvas>
            <canvas
                id="canvas-board-copy"
                className="absolute z-[2] overscroll-none"
                ref={canvasBoard.CanvasCopyRef}
            ></canvas>
        </div>
    );
});
