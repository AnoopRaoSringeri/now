import { observer } from "mobx-react";
import { useParams } from "react-router";

import { useCanvas } from "../hooks/use-canvas";
import { AiPromptRenderer } from "./ai-prompt-renderer";

export const AiPromptsRenderer = observer(function TablesRenderer() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");

    return (
        <div className="absolute  flex size-full overflow-hidden bg-transparent">
            {canvasBoard.AiPanelIds.map((id) => (
                <AiPromptRenderer key={id} board={canvasBoard} id={id} transform={canvasBoard.Transform} />
            ))}
        </div>
    );
});
