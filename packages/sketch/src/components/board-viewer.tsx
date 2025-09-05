import { observer } from "mobx-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { useCanvas } from "../hooks/use-canvas";
import { AppLoader, Button, useSidebar } from "@now/ui";
import { QueryKeys, useQueryNow, useStore } from "@now/utils";
import { useResizeObserver } from "@mantine/hooks";
import { CustomComponentsRenderer } from "../renderers/custom-component-renderer";
import { House, Expand } from "lucide-react";

export const BoardViewer = observer(function BoardViewer() {
    const { setOpen } = useSidebar();
    const [resizer, rect] = useResizeObserver();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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

    const goToHome = () => {
        navigate("/sketch-now");
    };

    const onExpand = () => {
        canvasBoard.UiStateManager.toggleFullScreen();
    };

    return (
        <div className="size-full">
            <div className="absolute left-5 top-5 z-[10] gap-1 flex ">
                <Button size="sm" onClick={goToHome}>
                    <House size="20px" />
                </Button>
                <Button size="sm" onClick={onExpand}>
                    <Expand size="20px" />
                </Button>
            </div>
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
