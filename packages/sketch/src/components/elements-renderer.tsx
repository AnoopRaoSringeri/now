import { observer } from "mobx-react";
import { useParams } from "react-router";

import { useCanvas } from "../hooks/use-canvas";
import { CustomComponentRendererWrapper } from "./custom-component-renderer";

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
