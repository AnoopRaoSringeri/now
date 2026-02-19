import { Button, Icon } from "@now/ui";
import { AiPrompt, BaseObject, CanvasBoard, ChartNow, cn, ElementEnum } from "@now/utils";
import { observer } from "mobx-react";
import { CSSProperties, useMemo } from "react";
import { useParams } from "react-router";
import { useCanvas } from "../hooks/use-canvas";
import { AiPromptRenderer } from "./ai-prompt-renderer";
import { ChartsRenderer } from "./chart-renderer";

export const CustomComponentsRenderer = observer(function CustomComponentsRenderer() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");

    const { scaleX: a, b, c, scaleY: d, transformX: e, transformY: f } = canvasBoard.Transform;

    const containerStyle: CSSProperties = useMemo(
        () => ({
            position: "absolute" as const,
            top: 0,
            left: 0,
            width: canvasBoard.Width, // logical canvas width
            height: canvasBoard.Height, // logical canvas height
            transform: `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`,
            transformOrigin: "top left",
            pointerEvents: "auto" as const
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
        <>
            <Controls />
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
        </>
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
            flexDirection: "column",
            pointerEvents: "auto"
        }),
        [x, y, h, w]
    );

    return (
        <div style={style}>
            <div className={cn("size-full flex flex-col", component.IsLocked || board.ReadOnly ? "z-[10]" : "")}>
                <Renderer component={component} />
            </div>
        </div>
    );
});

const Controls = observer(() => {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard: board } = useCanvas(id ?? "new");
    const elementId = board.SelectedElements[0]?.id;
    const component = board.getComponent(elementId);

    if (component == null || (!component.IsSelected && !component.IsLocked)) return null;

    const removeElement = () => {
        board.removeElement(elementId);
    };
    const copyElement = () => {
        board.copyElement(elementId);
    };
    const toggleLock = () => {
        component.IsLocked = !component.IsLocked;
    };
    const { scaleX, b, c, scaleY, transformX, transformY } = board.Transform;
    const { x = 0, y = 0, w = 0 } = component.Cords;
    const screenX = x * scaleX + transformX;
    const screenY = y * scaleY + transformY;

    return (
        <div
            style={{
                position: "absolute",
                left: screenX + w - 120,
                top: screenY - 40,
                zIndex: 10,
                display: "flex",
                width: 120
            }}
        >
            {component.IsSelected && (
                <>
                    <Button onClick={copyElement} size="icon" variant="ghost">
                        <Icon name="Copy" />
                    </Button>

                    <Button onClick={toggleLock} size="icon" variant="ghost">
                        {component.IsLocked ? <Icon name="LockOpen" /> : <Icon name="Lock" />}
                    </Button>

                    <Button onClick={removeElement} size="icon" variant="destructive">
                        <Icon name="Trash2" />
                    </Button>
                </>
            )}

            {!component.IsSelected && component.IsLocked && (
                <Button onClick={toggleLock} size="icon" variant="ghost">
                    <Icon name="LockOpen" />
                </Button>
            )}
        </div>
    );
});

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
