import { Chart, ChartType, EditorValue } from "@now/utils";

export class PieChart extends Chart {
    type: ChartType = "Pie";
    constructor(public config: Record<string, EditorValue>) {
        super(config, "Pie");
        //
    }
}
