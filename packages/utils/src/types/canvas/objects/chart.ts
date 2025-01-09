import { BaseObject } from "../base-object";
import { ChartObject } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";
import { Chart } from "../../visualize/chart";
import { ChartFactory } from "../../visualize/chart-factory";

export class ChartNow extends BaseObject {
    object: ChartObject;
    chart: Chart;
    constructor(id: string, object: ChartObject, board: CanvasBoard) {
        super(id, object, board);
        this.object = object;
        this.chart = ChartFactory.restoreChart(object.value.metadata);
    }
    getValues(): ChartObject {
        return this.object;
    }
}
