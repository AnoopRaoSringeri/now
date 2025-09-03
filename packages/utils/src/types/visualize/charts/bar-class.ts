import { Chart } from "../chart";
import { ChartType } from "../types";
import { MultiMeasureSelectValue, SingleColumnSelectValue } from "../value-types";

export type BarChartConfig = {
    measures: { t: "m"; v: MultiMeasureSelectValue };
    dimensions: { t: "s"; v: SingleColumnSelectValue };
};

export class BarChart extends Chart {
    type: ChartType = "Bar";
    constructor(config: BarChartConfig) {
        super(config, "Bar");
    }
}
