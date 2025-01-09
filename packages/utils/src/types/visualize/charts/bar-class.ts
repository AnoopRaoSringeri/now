import { Chart } from "../chart";
import { ChartType } from "../types";
import { MultiColumnSelectValue, SingleColumnSelectValue } from "../value-types";

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
