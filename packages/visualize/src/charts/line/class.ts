import { Chart, ChartType, SingleColumnSelectValue, MultiColumnSelectValue } from "@now/utils";

export type LineChartConfig = {
    measures: { t: "m"; v: MultiColumnSelectValue };
    dimensions: { t: "s"; v: SingleColumnSelectValue };
};

export class LineChart extends Chart {
    type: ChartType = "Line";
    constructor(config: LineChartConfig) {
        super(config, "Line");
    }
}
