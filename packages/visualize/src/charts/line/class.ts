import { Chart, ChartType, MultiColumnSelectType, OptionType } from "@now/utils";

export type LineChartConfig = { xAxis: MultiColumnSelectType; yAxis: MultiColumnSelectType };
export class LineChart extends Chart {
    type: ChartType = "Line";
    constructor(public config: OptionType) {
        super(config, "Line");
    }
}
