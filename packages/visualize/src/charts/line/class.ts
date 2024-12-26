import { Chart, ChartType, EditorValue } from "@now/utils";

export class LineChart extends Chart {
    type: ChartType = "Line";
    constructor(public config: Record<string, EditorValue>) {
        super(config, "Line");
        //
    }
}
