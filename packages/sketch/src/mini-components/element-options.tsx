import { Button, Icon, Label } from "@now/ui";
import { observer } from "mobx-react";
import { useParams } from "react-router";
import { useCanvas } from "../hooks/use-canvas";
import { ChartOptionsRendererWrapper, ChartSelect } from "@now/visualize";
import { runInAction } from "mobx";
import { ChartFactory } from "@now/utils";

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
    const { chart } = element;
    if (!chart) {
        return null;
    }
    function removeElement() {
        canvasBoard.removeElement(element.id);
    }

    function copyElement() {
        canvasBoard.copyElement(element.id);
    }

    return (
        <div className="flex flex-col gap-4 " id={`element-options-${element.id}`}>
            <div>
                <Label>{"Chart Type"}</Label>
                <ChartSelect
                    value={chart.type}
                    onChange={(c) => {
                        runInAction(() => {
                            element.chart = ChartFactory.createChart(c, chart.columnConfig);
                        });
                    }}
                />
            </div>
            {element.chart ? <ChartOptionsRendererWrapper chart={chart} /> : null}
            <div className="flex gap-2">
                <Button size="xs" variant="ghost" onClick={copyElement}>
                    <Icon name="Copy" size={20} />
                </Button>
                <Button size="xs" variant="destructive" onClick={removeElement}>
                    <Icon name="Trash2" size={20} />
                </Button>
            </div>
        </div>
    );
});
