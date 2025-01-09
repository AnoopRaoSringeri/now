import { Button, Icon } from "@now/ui";

import { observer } from "mobx-react";
import { useMemo, useState } from "react";
// import { CanvasBoard } from "../canvas/canvas-board";
import { CanvasHelper } from "../helpers/canvas-helpers";
import { useCanvas } from "../hooks/use-canvas";
import { useParams } from "react-router";
import { BaseObject, CanvasBoard, ChartNow, ElementEnum, ICanvasObjectWithId } from "@now/utils";
import { ChartsRenderer } from "./chart-renderer";
import { AiPromptRenderer } from "./ai-prompt-renderer";
import { DataUploader } from "../mini-components/data-uploader";

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
    const component = board.getComponent(id);
    const { type } = component.getValues();
    const { x = 0, y = 0, h = 0, w = 0 } = component.Cords;
    const transform = board.Transform;
    const { ax, ay } = CanvasHelper.getAbsolutePosition({ x, y }, transform);
    const [isLocked, setIsLocked] = useState(true);

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
            flexDirection: "column",
            padding: 10
        }),
        [ax, ay, h, transform.scaleX, w]
    );

    const removeElement = () => {
        board.removeElement(id);
    };

    return (
        <div style={style}>
            <div style={{ zoom: transform.scaleX }} className="absolute top-[-40px] right-0 z-[60] flex">
                <Button onClick={() => setIsLocked((pre) => !pre)} size="icon" variant="ghost">
                    {isLocked ? <Icon name="LockOpen" /> : <Icon name="Lock" />}
                </Button>
                {type === ElementEnum.Chart ? <DataUploader id={id} component={component as ChartNow} /> : null}
                <Button onClick={removeElement} size="icon" variant="destructive">
                    <Icon name="Trash2" />
                </Button>
            </div>
            <div style={{ zoom: transform.scaleX }} className="size-full">
                <Renderer component={component} />
            </div>
        </div>
    );
});

const Renderer = observer(function Renderer({ component }: { component: BaseObject }) {
    const { type, value } = component.getValues();
    switch (type) {
        case ElementEnum.AiPrompt:
            return <AiPromptRenderer component={component} />;
        case ElementEnum.Chart:
            return <ChartsRenderer component={component as ChartNow} />;
    }
});
