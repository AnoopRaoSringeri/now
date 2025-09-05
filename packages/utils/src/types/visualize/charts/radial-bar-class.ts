import { Chart } from "../chart";
import { ChartType } from "../types";
import { SingleMeasureSelectValue, SingleColumnSelectValue } from "../value-types";

export type RadialBarChartConfig = {
    measures: { t: "s"; v: SingleMeasureSelectValue };
    dimensions: { t: "s"; v: SingleColumnSelectValue };
};

export class RadialBarChart extends Chart {
    type: ChartType = "RadialBar";
    constructor(config: RadialBarChartConfig) {
        super(config, "RadialBar");
    }
}
