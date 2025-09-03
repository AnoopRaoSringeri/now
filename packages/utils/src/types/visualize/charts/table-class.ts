import { Chart } from "../chart";
import { MultiColumnSelectValue, MultiMeasureSelectValue } from "../value-types";

export type TableChartConfig = {
    measures: { t: "m"; v: MultiMeasureSelectValue };
    dimensions: { t: "m"; v: MultiColumnSelectValue };
};

export class TableChart extends Chart {
    constructor(config: TableChartConfig) {
        super(config, "Table");
    }
}
