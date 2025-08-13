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
import { IObjectStyle } from "../types/sketch-now/object-styles";
import { CanvasBoard } from "./canvas-board";
import { v4 as uuid } from "uuid";

export class CanvasObjectFactory {
    static createObject(id: string, object: CanvasObject, board: CanvasBoard, style: IObjectStyle) {
        switch (object.type) {
            case ElementEnum.Pencil:
                return new Pencil(id, object, board, style);
            case ElementEnum.Square:
                return new Square(id, object, board, style);
            case ElementEnum.Rectangle:
                return new Rectangle(id, object, board, style);
            case ElementEnum.Image:
                return new CanvasImage(id, object, board, style);
            case ElementEnum.Text:
                return new Text(id, object, board, style);
            case ElementEnum.Circle:
                return new Circle(id, object, board, style);
            case ElementEnum.Line:
                return new Line(id, object, board, style);
            case ElementEnum.AiPrompt:
                return new AiPrompt(id, object, board, style);
            case ElementEnum.Chart:
                return new ChartNow(id, object, board, style);
            default:
                return new BaseObject(id, object, board, style);
        }
    }

    static createNewObject(type: ElementEnum, position: Position, board: CanvasBoard) {
        switch (type) {
            case ElementEnum.Pencil:
                return new Pencil(
                    uuid(),
                    { type: type, value: { points: [[position.x, position.y]] } },
                    board,
                    board.Style
                );
            case ElementEnum.Square:
                return new Square(uuid(), { type: type, value: { ...position, h: 0 } }, board, board.Style);
            case ElementEnum.Rectangle:
                return new Rectangle(uuid(), { type: type, value: { ...position, h: 0, w: 0 } }, board, board.Style);
            case ElementEnum.Image:
                return new CanvasImage(
                    uuid(),
                    { type: type, value: { ...position, h: 0, w: 0, value: "" } },
                    board,
                    board.Style
                );
            case ElementEnum.Text:
                return new Text(
                    uuid(),
                    { type: type, value: { ...position, value: "", h: Number(board.Style.font?.size ?? 0), w: 0 } },
                    board,
                    board.Style
                );
            case ElementEnum.Circle:
                return new Circle(uuid(), { type: type, value: { ...position, h: 0, w: 0 } }, board, board.Style);
            case ElementEnum.Line:
                return new Line(
                    uuid(),
                    { type: type, value: { sx: position.x, sy: position.y, ex: position.x, ey: position.y } },
                    board,
                    board.Style
                );
            case ElementEnum.AiPrompt:
                return new AiPrompt(
                    uuid(),
                    { type: type, value: { ...position, h: 0, w: 0, prompt: "" } },
                    board,
                    board.Style
                );
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
                    board,
                    board.Style
                );
            default:
                throw Error();
        }
    }
}
