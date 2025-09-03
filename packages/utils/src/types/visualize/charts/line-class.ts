import { Chart } from "../chart";
import { ChartType } from "../types";
import { MultiMeasureSelectValue, SingleColumnSelectValue } from "../value-types";

export type LineChartConfig = {
    measures: { t: "m"; v: MultiMeasureSelectValue };
    dimensions: { t: "s"; v: SingleColumnSelectValue };
};

export class LineChart extends Chart {
    type: ChartType = "Line";
    constructor(config: LineChartConfig) {
        super(config, "Line");
    }
}
