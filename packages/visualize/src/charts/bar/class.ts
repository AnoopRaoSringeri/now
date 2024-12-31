import { Chart, ChartType, ColumnSelectType, MultiColumnSelectType } from "@now/utils";

export type BarChartConfig = { xAxis: ColumnSelectType; yAxis: MultiColumnSelectType };

export class BarChart extends Chart {
    type: ChartType = "Bar";
    constructor(public config: BarChartConfig) {
        super(config, "Bar");
    }
}
