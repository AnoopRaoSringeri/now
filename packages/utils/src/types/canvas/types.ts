import { ElementEnum } from "../sketch-now/enums";
import { ChartMetadata } from "../visualize/chart";

// 2. Coordinate and Data primitives
export type XYHW = { x: number; y: number; h: number; w: number };
export type XYH = { x: number; y: number; h: number };
export type XY = { x: number; y: number };
export type LinePoints = { sx: number; sy: number; ex: number; ey: number };
export type PointsArray = { points: [number, number][] };

// 3. Specialized Values
export type TextValue = XYHW & { value: string };
export type ImageValue = XYHW & { value: string };
export type ChartValue = XYHW & { metadata: ChartMetadata };
export type AiPromptValue = XYHW & { prompt: string };
export type LinkValue = {
    start: (XY & { id: string }) | null;
    end: (XY & { id: string }) | null;
};

// type ValueType =
//     | XYHW
//     | XYH
//     | LinePoints
//     | TextValue
//     | PointsArray
//     | ImageValue
//     | ChartValue
//     | AiPromptValue
//     | LinkValue;

// type StrictCanvasMap<T extends Record<ElementEnum, ValueType>> = T;

// export type CanvasObjectMap = StrictCanvasMap<{
//     [ElementEnum.Rectangle]: XYHW;
//     [ElementEnum.Square]: XYH;
//     [ElementEnum.Circle]: XYHW;
//     [ElementEnum.Line]: LinePoints;
//     [ElementEnum.Text]: TextValue;
//     [ElementEnum.Pencil]: PointsArray;
//     [ElementEnum.Link]: LinkValue;
//     [ElementEnum.Image]: ImageValue;
//     [ElementEnum.Chart]: ChartValue;
//     [ElementEnum.AiPrompt]: AiPromptValue;
// }>;

// // 2. Generate the Union Type automatically
// export type CanvasObject = {
//     [K in keyof CanvasObjectMap]: {
//         type: K;
//         value: CanvasObjectMap[K];
//     };
// }[keyof CanvasObjectMap];

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
    value: ImageValue;
};

export type ChartObject = {
    type: ElementEnum.Chart;
    value: ChartValue;
};

export type AiPromptObject = {
    type: ElementEnum.AiPrompt;
    value: AiPromptValue;
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
