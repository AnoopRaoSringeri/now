import { Button, Icon } from "@now/ui";
import { AiPrompt, BaseObject, CanvasBoard, CanvasHelper, ChartNow, cn, ElementEnum } from "@now/utils";
import { observer } from "mobx-react";
import { useMemo } from "react";
import { useParams } from "react-router";
import { useCanvas } from "../hooks/use-canvas";
import { AiPromptRenderer } from "./ai-prompt-renderer";
import { ChartsRenderer } from "./chart-renderer";

/**
 * Main Container
 */
export const CustomComponentsRenderer = observer(() => {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");

    return (
        <div className="absolute flex size-full overflow-hidden bg-transparent pointer-events-none">
            {canvasBoard.CustomComponentIds.map((componentId) => (
                <CustomComponentRendererWrapper key={componentId} board={canvasBoard} id={componentId} />
            ))}
        </div>
    );
});

/**
 * Positioning Wrapper
 */
const CustomComponentRendererWrapper = observer(({ id, board }: { id: string; board: CanvasBoard }) => {
    const component = board.getComponent(id);
    if (!component) return null;

    const { x = 0, y = 0, h = 0, w = 0 } = component.Cords;
    const { scaleX } = board.Transform;

    // Calculate absolute position based on canvas transform
    const { ax, ay } = useMemo(
        () => CanvasHelper.getAbsolutePosition({ x, y }, board.Transform),
        [x, y, board.Transform]
    );

    const style: React.CSSProperties = useMemo(
        () => ({
            top: ay,
            left: ax,
            height: h * scaleX,
            width: w * scaleX,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            pointerEvents: "auto"
        }),
        [ax, ay, h, w, scaleX]
    );

    return (
        <div style={style}>
            <ComponentToolbar component={component} board={board} />

            <div
                style={{ zoom: scaleX }}
                className={cn("size-full flex flex-col", (component.IsLocked || board.ReadOnly) && "z-[10]")}
            >
                <Renderer component={component} />
            </div>
        </div>
    );
});

/**
 * Extracted Toolbar Logic
 */
const ComponentToolbar = observer(({ component, board }: { component: BaseObject; board: CanvasBoard }) => {
    if (board.ReadOnly) return null;

    // Logic: Show toolbar if selected, or show only Lock toggle if locked
    const showFullToolbar = component.IsSelected && !component.IsLocked;
    const showLockOnly = component.IsLocked;

    if (!showFullToolbar && !showLockOnly) return null;

    const toggleLock = () => {
        component.IsLocked = !component.IsLocked;
    };
    const remove = () => board.removeElement(component.id);
    const copy = () => board.copyElement(component.id);

    return (
        <div style={{ zoom: board.Transform.scaleX }} className="absolute top-[-40px] right-0 z-[6] flex gap-1">
            {showFullToolbar && (
                <Button onClick={copy} size="icon" variant="ghost">
                    <Icon name="Copy" />
                </Button>
            )}

            <Button onClick={toggleLock} size="icon" variant="ghost">
                <Icon name={component.IsLocked ? "LockOpen" : "Lock"} />
            </Button>

            {showFullToolbar && (
                <Button onClick={remove} size="icon" variant="destructive">
                    <Icon name="Trash2" />
                </Button>
            )}
        </div>
    );
});

/**
 * Strategy-based Component Switch
 */
const Renderer = observer(({ component }: { component: BaseObject }) => {
    switch (component.Type) {
        case ElementEnum.AiPrompt:
            return <AiPromptRenderer component={component as AiPrompt} />;
        case ElementEnum.Chart:
            return <ChartsRenderer component={component as ChartNow} />;
        default:
            return null;
    }
});
