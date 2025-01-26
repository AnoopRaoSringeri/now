import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { ImageInput } from "../mini-components/image-input";
import { TextEditorWrapper } from "../mini-components/text-editor";
import CanvasOptions from "./canvas-options";
import { useCanvas } from "../hooks/use-canvas";
import { AppLoader, useSidebar } from "@now/ui";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@now/utils";
import { useFullscreen, useResizeObserver } from "@mantine/hooks";
import { CustomComponentsRenderer } from "../renderers/custom-component-renderer";

export const CanvasBoard = observer(function CanvasBoard() {
    const { setOpen } = useSidebar();
    const { toggle, ref } = useFullscreen();
    const [resizer, rect] = useResizeObserver();
    const { id } = useParams<{ id: string }>();
    const { canvasBoard, onResize } = useCanvas(id ?? "new");
    const [sketchName, setSketchName] = useState("");
    const { sketchStore } = useStore();
    const canvas = canvasBoard.CanvasRef;

    const { data, isLoading: sketchLoading } = useQuery({
        queryFn: async () => {
            if (id && id !== "new") {
                return await sketchStore.GetSketchById(id);
            } else {
                return null;
            }
        },
        queryKey: ["Sketch", id],
        refetchOnMount: false,
        refetchOnWindowFocus: false
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
            setSketchName(data.name);
            canvasBoard.loadBoard(data.metadata, {
                draw: true,
                height: window.innerHeight,
                width: window.innerWidth,
                readonly: false
            });
        } else {
            canvasBoard.createBoard({});
        }
    }, [canvas, canvasBoard, data, id]);

    return (
        <div ref={ref} className="size-full">
            <div className="size-full absolute z-0" ref={resizer} />
            <AppLoader loading={sketchLoading} />
            <CanvasOptions name={sketchName} onExpand={toggle} />
            <TextEditorWrapper />
            <ImageInput />
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
