import { ChartNow } from "../types/canvas/objects/chart";
import { Circle } from "../types/canvas/objects/circle";
import { Image } from "../types/canvas/objects/image";
import { Rectangle } from "../types/canvas/objects/rectangle";
import { Square } from "../types/canvas/objects/square";
import { Text } from "../types/canvas/objects/text";
import { CanvasObject } from "../types/canvas/types";
import { Position } from "../types/sketch-now/canvas";
import { ElementEnum } from "../types/sketch-now/enums";
import { CanvasBoard } from "./canvas-board";
import { v4 as uuid } from "uuid";

export class CanvasObjectFactory {
    static createObject(object: CanvasObject, board: CanvasBoard) {
        switch (object.type) {
            case ElementEnum.Rectangle:
                return new Rectangle(uuid(), object, board);
            default:
                throw Error();
        }
    }

    static createNewObject(type: ElementEnum, position: Position, board: CanvasBoard) {
        switch (type) {
            case ElementEnum.Square:
                return new Square(uuid(), { type: type, value: { ...position, h: 0 } }, board);
            case ElementEnum.Rectangle:
                return new Rectangle(uuid(), { type: type, value: { ...position, h: 0, w: 0 } }, board);
            case ElementEnum.Image:
                return new Image(uuid(), { type: type, value: { ...position, h: 0, w: 0, value: "" } }, board);
            case ElementEnum.Text:
                return new Text(uuid(), { type: type, value: { ...position, value: "" } }, board);
            case ElementEnum.Circle:
                return new Circle(uuid(), { type: type, value: { ...position, h: 0, w: 0 } }, board);
            // case ElementEnum.Chart:
            //     return new ChartNow(
            //         uuid(),
            //         {
            //             type: type,
            //             value: {
            //                 ...position,
            //                 h: 0,
            //                 w: 0,
            //                 metadata: {
            //                     columnConfig: [],
            //                     config: {
            //                         dimensions: {
            //                             t: "m",
            //                             v: {
            //                                 t: "mcs",
            //                                 v: []
            //                             }
            //                         },
            //                         measures: {
            //                             t: "m",
            //                             v: {
            //                                 t: "mcs",
            //                                 v: []
            //                             }
            //                         }
            //                     },
            //                     type: "Table",
            //                     source: null,
            //                     options: {}
            //                 }
            //             }
            //         },
            //         board
            //     );
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
