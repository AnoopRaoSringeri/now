import { Chart } from "../visualize/chart";
import { ChartType } from "../visualize/types";
import { ICanvas, ICanvasObjectMethods } from "./custom-canvas";
import { ChartEnum, ElementEnum } from "./enums";
import { IObjectStyle } from "./object-styles";

export interface IObjectValue {
    x: number;
    y: number;
    h: number;
    w: number;
    sa: number;
    ea: number;
    ro: number;
    points: [number, number][];
    value: string;
    style: IObjectStyle;
    chartType: ChartType;
    chart: Chart;
}

export interface IObjectValueWithId extends Partial<IObjectValue> {
    id: string;
}

export interface ObjectOptions {
    IsSelected: boolean;
    IsDragging: boolean;
    ShowSelection: boolean;
}
export interface ICanvasObject extends Partial<IObjectValue>, ICanvasObjectMethods, ObjectOptions {
    type: ElementEnum;
    order: number;
    readonly Board: ICanvas;
}

export interface ICanvasObjectWithId extends ICanvasObject {
    id: string;
}

export type PartialCanvasObject = Partial<ICanvasObject> & { id: string };

export type CanvasObject = PartialCanvasObject & { type: ElementEnum };
