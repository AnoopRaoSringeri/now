import { Chart, ChartType, MultiColumnSelectType, OptionType } from "@now/utils";

export type TableChartConfig = { column: MultiColumnSelectType };
export class TableChart extends Chart {
    type: ChartType = "Table";
    constructor(public config: OptionType) {
        super(config, "Table");
    }
}
