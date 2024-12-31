import { Button, Icon } from "@now/ui";

import { observer } from "mobx-react";
import { useState } from "react";
import { CanvasBoard } from "../canvas/canvas-board";
import { CanvasHelper } from "../helpers/canvas-helpers";
import { useCanvas } from "../hooks/use-canvas";
import { useParams } from "react-router";
import { ElementEnum, ICanvasObjectWithId } from "@now/utils";
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
    const { x = 0, y = 0, h = 0, w = 0 } = component.getValues();
    const transform = board.Transform;
    const { ax, ay } = CanvasHelper.getAbsolutePosition({ x, y }, transform);
    const [isLocked, setIsLocked] = useState(true);

    const style: React.CSSProperties = {
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
    };

    const removeElement = () => {
        board.removeElement(id);
    };

    return (
        <div style={style}>
            <div className="absolute top-[-40px] right-0 z-[60] flex">
                <Button onClick={() => setIsLocked((pre) => !pre)} size="icon" variant="ghost">
                    {isLocked ? <Icon name="LockOpen" /> : <Icon name="Lock" />}
                </Button>
                {component.type === ElementEnum.Chart ? <DataUploader id={id} component={component} /> : null}
                <Button onClick={removeElement} size="icon" variant="destructive">
                    <Icon name="Trash2" />
                </Button>
            </div>
            <Renderer component={component} />
        </div>
    );
});

const Renderer = observer(function Renderer({ component }: { component: ICanvasObjectWithId }) {
    switch (component.type) {
        case ElementEnum.AiPrompt:
            return <AiPromptRenderer component={component} />;
        case ElementEnum.Chart:
            return <ChartsRenderer component={component} />;
    }
});
