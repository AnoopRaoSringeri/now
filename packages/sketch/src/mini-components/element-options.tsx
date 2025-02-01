import { observer } from "mobx-react";
import { useParams } from "react-router";
import { useCanvas } from "../hooks/use-canvas";
import { ChartNow } from "@now/utils";
import { ChartOptions } from "./chart-options";
import { Button, Icon } from "@now/ui";

export const ElementOptions = observer(function ElementOptions() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");
    const selectedElements = canvasBoard.SelectedElements;
    const copyEle = selectedElements[0];
    if (!copyEle) {
        return null;
    }
    const element = canvasBoard.getComponent(copyEle.id);
    if (!element) {
        return null;
    }

    function removeElement() {
        canvasBoard.removeElement(element.id);
    }

    function copyElement() {
        canvasBoard.copyElement(element.id);
    }

    return (
        <div className="flex flex-col gap-2 justify-end " id={`element-options-${element.id}`}>
            {element instanceof ChartNow ? (
                <ChartOptions element={element} />
            ) : (
                <div className="flex gap-4 justify-end">
                    <Button size="xs" variant="ghost" onClick={copyElement}>
                        <Icon name="Copy" size={20} />
                    </Button>
                    <Button size="xs" variant="destructive" onClick={removeElement}>
                        <Icon name="Trash2" size={20} />
                    </Button>
                </div>
            )}
        </div>
    );
});
