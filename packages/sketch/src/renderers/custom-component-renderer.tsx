import { Button, Icon } from "@now/ui";
import { AiPrompt, BaseObject, CanvasBoard, ChartNow, cn, ElementEnum } from "@now/utils";
import { observer } from "mobx-react";
import { useMemo } from "react";
import { useParams } from "react-router";
import { useCanvas } from "../hooks/use-canvas";
import { AiPromptRenderer } from "./ai-prompt-renderer";
import { ChartsRenderer } from "./chart-renderer";

export const CustomComponentsRenderer = observer(function CustomComponentsRenderer() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");

    const { scaleX: a, b, c, scaleY: d, transformX: e, transformY: f } = canvasBoard.Transform;

    const containerStyle = useMemo(
        () => ({
            position: "absolute" as const,
            top: 0,
            left: 0,
            width: canvasBoard.Width, // logical canvas width
            height: canvasBoard.Height, // logical canvas height
            transform: `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`,
            transformOrigin: "top left",
            pointerEvents: "none" as const
        }),
        [a, b, c, d, e, f, canvasBoard.Width, canvasBoard.Height]
    );

    const visibleArea = useMemo(() => {
        const { scaleX: a, transformX: e, transformY: f } = canvasBoard.Transform;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        return {
            x: -e / a,
            y: -f / a,
            w: viewportWidth / a,
            h: viewportHeight / a
        };
    }, [canvasBoard.Transform.scaleX, canvasBoard.Transform.transformX, canvasBoard.Transform.transformY]);

    return (
        <div style={containerStyle}>
            {canvasBoard.CustomComponentIds.map((id) => canvasBoard.getComponent(id))
                .filter((component) => {
                    const { x, y, w, h } = component.Cords;

                    return !(
                        x + w < visibleArea.x ||
                        x > visibleArea.x + visibleArea.w ||
                        y + h < visibleArea.y ||
                        y > visibleArea.y + visibleArea.h
                    );
                })
                .map((component) => (
                    <CustomComponentRendererWrapper key={component.id} board={canvasBoard} id={component.id} />
                ))}
        </div>
    );
});

const CustomComponentRendererWrapper = observer(function CustomComponentRendererWrapper({
    id,
    board
}: {
    id: string;
    board: CanvasBoard;
}) {
    const component = board.getComponent(id);
    const { x = 0, y = 0, h = 0, w = 0 } = component.Cords;

    const style = useMemo<React.CSSProperties>(
        () => ({
            position: "absolute",
            top: y,
            left: x,
            height: h,
            width: w,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
            // pointerEvents: "auto"
        }),
        [x, y, h, w]
    );

    const removeElement = () => board.removeElement(id);
    const copyElement = () => board.copyElement(id);
    const toggleLock = () => (component.IsLocked = !component.IsLocked);

    return (
        <div style={style}>
            {!board.ReadOnly && (
                <Controls
                    component={component}
                    onCopy={copyElement}
                    onDelete={removeElement}
                    onToggleLock={toggleLock}
                />
            )}

            <div className={cn("size-full flex flex-col", component.IsLocked || board.ReadOnly ? "z-[10]" : "")}>
                <Renderer component={component} />
            </div>
        </div>
    );
});

const Controls = ({
    component,
    onCopy,
    onDelete,
    onToggleLock
}: {
    component: BaseObject;
    onCopy: () => void;
    onDelete: () => void;
    onToggleLock: () => void;
}) => {
    if (!component.IsSelected && !component.IsLocked) return null;

    return (
        <div className="absolute -top-10 right-0 z-[6] flex gap-1">
            {component.IsSelected && (
                <>
                    <Button onClick={onCopy} size="icon" variant="ghost">
                        <Icon name="Copy" />
                    </Button>

                    <Button onClick={onToggleLock} size="icon" variant="ghost">
                        {component.IsLocked ? <Icon name="LockOpen" /> : <Icon name="Lock" />}
                    </Button>

                    <Button onClick={onDelete} size="icon" variant="destructive">
                        <Icon name="Trash2" />
                    </Button>
                </>
            )}

            {!component.IsSelected && component.IsLocked && (
                <Button onClick={onToggleLock} size="icon" variant="ghost">
                    <Icon name="LockOpen" />
                </Button>
            )}
        </div>
    );
};

const Renderer = observer(function Renderer({ component }: { component: BaseObject }) {
    switch (component.Type) {
        case ElementEnum.AiPrompt:
            return <AiPromptRenderer component={component as AiPrompt} />;

        case ElementEnum.Chart:
            return <ChartsRenderer component={component as ChartNow} />;

        default:
            return null;
    }
});
