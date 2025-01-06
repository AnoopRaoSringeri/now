import { Chart, ChartType, MultiColumnSelectValue, SingleColumnSelectValue } from "@now/utils";

export type BarChartConfig = {
    measures: { t: "m"; v: MultiColumnSelectValue };
    dimensions: { t: "s"; v: SingleColumnSelectValue };
};

export class BarChart extends Chart {
    type: ChartType = "Bar";
    constructor(config: BarChartConfig) {
        super(config, "Bar");
    }
}
