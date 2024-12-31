import { Chart, ChartType, ColumnSelectType } from "@now/utils";

export type PieChartConfig = { measure: ColumnSelectType; dimension: ColumnSelectType };

export class PieChart extends Chart {
    type: ChartType = "Pie";
    constructor(public config: PieChartConfig) {
        super(config, "Pie");
    }
}
