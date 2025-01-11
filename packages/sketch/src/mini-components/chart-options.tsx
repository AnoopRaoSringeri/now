import { Label } from "@now/ui";
import { observer } from "mobx-react";
import { ChartOptionsRendererWrapper, ChartSelect } from "@now/visualize";
import { runInAction } from "mobx";
import { ChartFactory, ChartNow } from "@now/utils";

export const ChartOptions = observer(function ChartOptions({ element }: { element: ChartNow }) {
    const { chart } = element;
    if (!chart) {
        return null;
    }

    return (
        <>
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
        </>
    );
});
