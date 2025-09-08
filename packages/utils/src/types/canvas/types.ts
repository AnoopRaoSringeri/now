import { ElementEnum } from "../sketch-now/enums";
import { ChartMetadata } from "../visualize/chart";

export type XYHW = {
    x: number;
    y: number;
    h: number;
    w: number;
};

export type XYH = {
    x: number;
    y: number;
    h: number;
};

export type LinePoints = {
    sx: number;
    sy: number;
    ex: number;
    ey: number;
};

export type XY = {
    x: number;
    y: number;
};

export type TextValue = XYHW & { value: string };

export type LinkValue = {
    start:
        | (CanvasObject & {
              id: string;
          })
        | null;
    end:
        | (CanvasObject & {
              id: string;
          })
        | null;
};

export type PointsArray = {
    points: [number, number][];
};

export type RectangleObject = {
    type: ElementEnum.Rectangle;
    value: XYHW;
};

export type SquareObject = {
    type: ElementEnum.Square;
    value: XYH;
};

export type CircleObject = {
    type: ElementEnum.Circle;
    value: XYHW;
};

export type LineObject = {
    type: ElementEnum.Line;
    value: LinePoints;
};

export type TextObject = {
    type: ElementEnum.Text;
    value: TextValue;
};

export type PencilObject = {
    type: ElementEnum.Pencil;
    value: PointsArray;
};

export type ImageObject = {
    type: ElementEnum.Image;
    value: XYHW & { value: string };
};

export type ChartObject = {
    type: ElementEnum.Chart;
    value: XYHW & { metadata: ChartMetadata };
};

export type AiPromptObject = {
    type: ElementEnum.AiPrompt;
    value: XYHW & { prompt: string };
};

export type LinkObject = {
    type: ElementEnum.Link;
    value: LinkValue;
};

export type CanvasObject =
    | RectangleObject
    | SquareObject
    | CircleObject
    | LineObject
    | TextObject
    | PencilObject
    | ImageObject
    | ChartObject
    | AiPromptObject
    | LinkObject;
