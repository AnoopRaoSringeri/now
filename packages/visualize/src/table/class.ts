import { Chart, ChartType, EditorValue } from "@now/utils";

export class TableChart extends Chart {
    type: ChartType = "Table";
    constructor(public config: Record<string, EditorValue>) {
        super(config, "Table");
        //
    }
}
