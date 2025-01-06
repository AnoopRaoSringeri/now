import { Chart, ChartType, MultiColumnSelectValue } from "@now/utils";

export type TableChartConfig = {
    measures: { t: "m"; v: MultiColumnSelectValue };
    dimensions: { t: "m"; v: MultiColumnSelectValue };
};

export class TableChart extends Chart {
    type: ChartType = "Table";
    constructor(config: TableChartConfig) {
        super(config, "Table");
    }
}
