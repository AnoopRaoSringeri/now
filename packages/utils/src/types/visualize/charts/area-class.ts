import { Chart } from "../chart";
import { ChartType } from "../types";
import { MultiColumnSelectValue, SingleColumnSelectValue } from "../value-types";

export type AreaChartConfig = {
    measures: { t: "m"; v: MultiColumnSelectValue };
    dimensions: { t: "s"; v: SingleColumnSelectValue };
};

export class AreaChart extends Chart {
    type: ChartType = "Area";
    constructor(config: AreaChartConfig) {
        super(config, "Area");
    }
}
