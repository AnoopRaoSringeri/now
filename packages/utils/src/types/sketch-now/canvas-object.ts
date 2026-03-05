import { IObjectStyle } from "./object-styles";
import { CanvasObject } from "../canvas/types";
import { Position, Delta, CanvasElement } from "./canvas";
import { MouseAction, CursorPosition } from "./custom-canvas";

export interface IBaseObject<TValue extends CanvasObject = CanvasObject> {
    // Core Properties
    readonly id: string;
    object: CanvasObject;
    style: IObjectStyle;
    isSelected: boolean;
    isLocked: boolean;

    // Computed / Getters
    readonly Cords: { x: number; y: number; w: number; h: number };
    readonly Type: TValue["type"];

    // Actions
    draw(ctx: CanvasRenderingContext2D): void;
    move(ctx: CanvasRenderingContext2D, position: Position, action: MouseAction, clearCanvas?: boolean): void;
    resize(
        ctx: CanvasRenderingContext2D,
        delta: Delta,
        cPos: CursorPosition,
        action: MouseAction,
        clearCanvas?: boolean
    ): { x: number; y: number; w: number; h: number };
    updateValue(
        ctx: CanvasRenderingContext2D,
        objectValue: TValue["value"], // Extracts the specific value type (e.g., XYHW or {points})
        action: MouseAction,
        clearCanvas?: boolean
    ): void;
    updateStyle<T extends keyof IObjectStyle>(
        ctx: CanvasRenderingContext2D,
        key: T,
        value: IObjectStyle[T],
        clearCanvas?: boolean
    ): void;

    select(cords: Partial<{ x: number; y: number; w: number; h: number }>): void;
    unSelect(): void;
    toJSON(): CanvasElement;
}
