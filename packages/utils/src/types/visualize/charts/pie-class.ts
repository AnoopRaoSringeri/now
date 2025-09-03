import { Chart } from "../chart";
import { ChartType } from "../types";
import { SingleMeasureSelectValue, SingleColumnSelectValue } from "../value-types";

export type PieChartConfig = {
    measures: { t: "s"; v: SingleMeasureSelectValue };
    dimensions: { t: "s"; v: SingleColumnSelectValue };
};

export class PieChart extends Chart {
    type: ChartType = "Pie";
    constructor(config: PieChartConfig) {
        super(config, "Pie");
    }
}
