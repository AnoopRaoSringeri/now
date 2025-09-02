import { Chart } from "../chart";
import { MultiColumnSelectValue } from "../value-types";

export type TableChartConfig = {
    measures: { t: "m"; v: MultiColumnSelectValue };
    dimensions: { t: "m"; v: MultiColumnSelectValue };
};

export class TableChart extends Chart {
    constructor(config: TableChartConfig) {
        super(config, "Table");
    }
}
