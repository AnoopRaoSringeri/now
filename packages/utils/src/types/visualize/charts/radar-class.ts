import { Chart } from "../chart";
import { ChartType } from "../types";
import { MultiMeasureSelectValue, SingleColumnSelectValue } from "../value-types";

export type RadarChartConfig = {
    measures: { t: "m"; v: MultiMeasureSelectValue };
    dimensions: { t: "s"; v: SingleColumnSelectValue };
};

export class RadarChart extends Chart {
    type: ChartType = "Radar";
    constructor(config: RadarChartConfig) {
        super(config, "Radar");
    }
}
