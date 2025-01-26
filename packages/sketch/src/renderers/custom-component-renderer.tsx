import { Button, Icon } from "@now/ui";

import { observer } from "mobx-react";
import { useMemo } from "react";
import { useCanvas } from "../hooks/use-canvas";
import { useParams } from "react-router";
import { AiPrompt, BaseObject, CanvasBoard, CanvasHelper, ChartNow, cn, ElementEnum } from "@now/utils";
import { ChartsRenderer } from "./chart-renderer";
import { AiPromptRenderer } from "./ai-prompt-renderer";

export const CustomComponentsRenderer = observer(function CustomComponentsRenderer() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");

    return (
        <div className="absolute  flex size-full overflow-hidden bg-transparent">
            {canvasBoard.CustomComponentIds.map((id) => (
                <CustomComponentRendererWrapper key={id} board={canvasBoard} id={id} />
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
    const { component } = board.getComponent(id);
    const { x = 0, y = 0, h = 0, w = 0 } = component.Cords;
    const transform = board.Transform;
    const { ax, ay } = CanvasHelper.getAbsolutePosition({ x, y }, transform);

    const style: React.CSSProperties = useMemo(
        () => ({
            top: ay,
            left: ax,
            height: h * transform.scaleX,
            width: w * transform.scaleX,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
        }),
        [ax, ay, h, transform.scaleX, w]
    );

    const removeElement = () => {
        board.removeElement(id);
    };

    return (
        <div style={style}>
            {board.ReadOnly ? null : (
                <div style={{ zoom: transform.scaleX }} className="absolute top-[-40px] right-0 z-[6] flex">
                    <Button
                        onClick={() => {
                            component.IsLocked = !component.IsLocked;
                        }}
                        size="icon"
                        variant="ghost"
                    >
                        {component.IsLocked ? <Icon name="LockOpen" /> : <Icon name="Lock" />}
                    </Button>
                    <Button onClick={removeElement} size="icon" variant="destructive">
                        <Icon name="Trash2" />
                    </Button>
                </div>
            )}
            <div
                style={{ zoom: transform.scaleX }}
                className={cn("size-full flex flex-col", component.IsLocked || board.ReadOnly ? "z-[10]" : "")}
            >
                <Renderer component={component} />
            </div>
        </div>
    );
});

const Renderer = observer(function Renderer({ component }: { component: BaseObject }) {
    switch (component.Type) {
        case ElementEnum.AiPrompt:
            return <AiPromptRenderer component={component as AiPrompt} />;
        case ElementEnum.Chart:
            return <ChartsRenderer component={component as ChartNow} />;
    }
});
