import { Chart, ChartType, SingleColumnSelectValue } from "@now/utils";

export type PieChartConfig = {
    measures: { t: "s"; v: SingleColumnSelectValue };
    dimensions: { t: "s"; v: SingleColumnSelectValue };
};

export class PieChart extends Chart {
    type: ChartType = "Pie";
    constructor(config: PieChartConfig) {
        super(config, "Pie");
    }
}
