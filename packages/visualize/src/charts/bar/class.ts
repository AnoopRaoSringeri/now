import { Chart, ChartType, EditorValue } from "@now/utils";

export class BarChart extends Chart {
    type: ChartType = "Bar";
    constructor(public config: Record<string, EditorValue>) {
        super(config, "Bar");
        //
    }
}
