import { BaseObject } from "../base-object";
import { CanvasObject, ChartObject } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";
import { Chart } from "../../visualize/chart";
import { ChartFactory } from "../../visualize/chart-factory";
import { makeObservable, observable } from "mobx";

export class ChartNow extends BaseObject {
    object: ChartObject;
    chart: Chart;
    constructor(id: string, object: ChartObject, board: CanvasBoard) {
        super(id, object, board);
        this.object = object;
        this.chart = ChartFactory.restoreChart(object.value.metadata);
        makeObservable(this, { chart: observable });
    }
    getValues(): ChartObject {
        return this.object;
    }
    toJSON(): CanvasObject & { id: string } {
        return {
            ...this.object,
            value: { ...this.object.value, metadata: this.chart.toJSON() },
            id: this.id
        };
    }
}
