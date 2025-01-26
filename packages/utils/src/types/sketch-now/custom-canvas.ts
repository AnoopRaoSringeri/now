import { AbsPosition, Delta, Position, Size } from "./canvas";
import { IObjectStyle } from "./object-styles";
import { IObjectValue, ObjectOptions } from "./canvas-object";
import { BaseObject } from "../canvas/base-object";
import { CanvasObject } from "../canvas/types";

export type MouseAction = "down" | "move" | "up";

export interface ICanvasObjectMethods {
    draw: (ctx: CanvasRenderingContext2D) => unknown;
    create: (ctx: CanvasRenderingContext2D) => unknown;
    update: (
        ctx: CanvasRenderingContext2D,
        objectValue: Partial<IObjectValue>,
        action: MouseAction,
        clearCanvas?: boolean
    ) => unknown;
    updateStyle: <T extends keyof IObjectStyle>(
        ctx: CanvasRenderingContext2D,
        key: T,
        value: IObjectStyle[T],
        clearCanvas?: boolean
    ) => unknown;
    move: (ctx: CanvasRenderingContext2D, position: Position, action: MouseAction, clearCanvas?: boolean) => unknown;
    select: (cords: Partial<IObjectValue>) => unknown;
    unSelect: () => unknown;
    resize: (
        ctx: CanvasRenderingContext2D,
        delta: Delta,
        curorPosition: CursorPosition,
        action: MouseAction,
        clearCanvas?: boolean
    ) => Position & { h: number; w: number };
    getPosition: () => Position & AbsPosition;
    getValues: () => CanvasObject;
    set: <T extends keyof ObjectOptions>(key: T, value: ObjectOptions[T]) => unknown;
    toSVG: (options: Size) => string;
}

export interface ICanvas {
    Transform: ICanvasTransform;
    Canvas: HTMLCanvasElement | null;
    ReadOnly: boolean;
    Elements: BaseObject[];
    toJSON: () => unknown;
    toSVG: (options: Size) => string;
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
