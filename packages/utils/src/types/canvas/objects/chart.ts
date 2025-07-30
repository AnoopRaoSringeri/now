import { BaseObject } from "../base-object";
import { ChartObject } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";
import { Chart } from "../../visualize/chart";
import { ChartFactory } from "../../visualize/chart-factory";
import { makeObservable, observable } from "mobx";
import { CanvasElement } from "../../sketch-now/canvas";
import { IObjectStyle } from "../../sketch-now/object-styles";

export class ChartNow extends BaseObject {
    object: ChartObject;
    chart: Chart;
    constructor(id: string, object: ChartObject, board: CanvasBoard, style: IObjectStyle) {
        super(id, object, board, style);
        this.object = object;
        this.chart = ChartFactory.restoreChart(object.value.metadata);
        makeObservable(this, { chart: observable });
    }
    getValues(): ChartObject {
        return this.object;
    }
    toJSON(): CanvasElement {
        return {
            ...this.object,
            value: { ...this.object.value, metadata: this.chart.toJSON() },
            id: this.id,
            style: this.Style
        };
    }
}
