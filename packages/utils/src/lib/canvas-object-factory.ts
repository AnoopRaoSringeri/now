import { BaseObject } from "../types/canvas/base-object";
import { AiPrompt } from "../types/canvas/objects/ai-prompt";
import { ChartNow } from "../types/canvas/objects/chart";
import { Circle } from "../types/canvas/objects/circle";
import { CanvasImage } from "../types/canvas/objects/image";
import { Line } from "../types/canvas/objects/line";
import { Pencil } from "../types/canvas/objects/pencil";
import { Rectangle } from "../types/canvas/objects/rectangle";
import { Square } from "../types/canvas/objects/square";
import { Text } from "../types/canvas/objects/text";
import { CanvasObject } from "../types/canvas/types";
import { Position } from "../types/sketch-now/canvas";
import { ElementEnum } from "../types/sketch-now/enums";
import { CanvasBoard } from "./canvas-board";
import { v4 as uuid } from "uuid";

export class CanvasObjectFactory {
    static createObject(id: string, object: CanvasObject, board: CanvasBoard) {
        switch (object.type) {
            case ElementEnum.Rectangle:
                return new Rectangle(id, object, board);
            case ElementEnum.Pencil:
                return new Pencil(id, object, board);
            case ElementEnum.Chart:
                return new ChartNow(id, object, board);
            case ElementEnum.AiPrompt:
                return new AiPrompt(id, object, board);
            default:
                return new BaseObject(id, object, board);
        }
    }

    static createNewObject(type: ElementEnum, position: Position, board: CanvasBoard) {
        switch (type) {
            case ElementEnum.Pencil:
                return new Pencil(uuid(), { type: type, value: { points: [[position.x, position.y]] } }, board);
            case ElementEnum.Square:
                return new Square(uuid(), { type: type, value: { ...position, h: 0 } }, board);
            case ElementEnum.Rectangle:
                return new Rectangle(uuid(), { type: type, value: { ...position, h: 0, w: 0 } }, board);
            case ElementEnum.Image:
                return new CanvasImage(uuid(), { type: type, value: { ...position, h: 0, w: 0, value: "" } }, board);
            case ElementEnum.Text:
                return new Text(uuid(), { type: type, value: { ...position, value: "" } }, board);
            case ElementEnum.Circle:
                return new Circle(uuid(), { type: type, value: { ...position, h: 0, w: 0 } }, board);
            case ElementEnum.Line:
                return new Line(
                    uuid(),
                    { type: type, value: { sx: position.x, sy: position.y, ex: position.x, ey: position.y } },
                    board
                );
            case ElementEnum.AiPrompt:
                return new AiPrompt(uuid(), { type: type, value: { ...position, h: 0, w: 0, prompt: "" } }, board);
            case ElementEnum.Chart:
                return new ChartNow(
                    uuid(),
                    {
                        type: type,
                        value: {
                            ...position,
                            h: 0,
                            w: 0,
                            metadata: {
                                columnConfig: [],
                                config: {
                                    dimensions: {
                                        t: "m",
                                        v: {
                                            t: "mcs",
                                            v: []
                                        }
                                    },
                                    measures: {
                                        t: "m",
                                        v: {
                                            t: "mcs",
                                            v: []
                                        }
                                    }
                                },
                                type: "Table",
                                source: null,
                                options: {}
                            }
                        }
                    },
                    board
                );
            default:
                throw Error();
        }
    }

    static loadObject(id: string, object: CanvasObject, board: CanvasBoard) {
        switch (object.type) {
            case ElementEnum.Rectangle:
                return new Rectangle(id, object, board);
        }
    }
}
