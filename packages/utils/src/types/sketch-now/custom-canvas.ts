import { BaseObject } from "../canvas/base-object";

export type MouseAction = "down" | "move" | "up";

export interface ICanvas {
    Transform: ICanvasTransform;
    Canvas: HTMLCanvasElement | null;
    ReadOnly: boolean;
    Elements: BaseObject[];
    toJSON: () => unknown;
}

export interface ICanvasTransform {
    scaleX: number;
    b: number;
    c: number;
    scaleY: number;
    transformX: number;
    transformY: number;
}

export type CursorPosition = "m" | "tl" | "tr" | "br" | "bl" | "l" | "r" | "t" | "b";
