import { Label } from "@now/ui";
import { observer } from "mobx-react";
import { ChartOptionsRendererWrapper, ChartSelect } from "@now/visualize";
import { runInAction } from "mobx";
import { ChartNow } from "@now/utils";

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
                    value={chart.Type}
                    onChange={(c) => {
                        runInAction(() => {
                            chart.Type = c;
                        });
                    }}
                />
            </div>
            {element.chart ? <ChartOptionsRendererWrapper chart={chart} /> : null}
        </>
    );
});
