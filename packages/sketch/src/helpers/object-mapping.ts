import { ElementEnum, PartialCanvasObject, ICanvasObjectWithId } from "@now/utils";
import { CanvasBoard } from "../canvas/canvas-board";
import { Circle } from "../canvas/canvas-objects/circle";
import { CanvasImage } from "../canvas/canvas-objects/image";
import { Line } from "../canvas/canvas-objects/line";
import { Pencil } from "../canvas/canvas-objects/pencil";
import { Rectangle } from "../canvas/canvas-objects/rectangle";
import { Square } from "../canvas/canvas-objects/square";
import { Table } from "../canvas/canvas-objects/table";
import { Text } from "../canvas/canvas-objects/text";

export const CavasObjectMap: {
    [key in ElementEnum]: (initValues: PartialCanvasObject, parent: CanvasBoard) => ICanvasObjectWithId;
} = {
    [ElementEnum.Rectangle]: (initValues, parent) => new Rectangle(initValues, parent),
    [ElementEnum.Line]: (initValues, parent) => new Line(initValues, parent),
    [ElementEnum.Square]: (initValues, parent) => new Square(initValues, parent),
    [ElementEnum.Circle]: (initValues, parent) => new Circle(initValues, parent),
    [ElementEnum.Pencil]: (initValues, parent) => new Pencil(initValues, parent),
    [ElementEnum.Text]: (initValues, parent) => new Text(initValues, parent),
    [ElementEnum.Image]: (initValues, parent) => new CanvasImage(initValues, parent),
    [ElementEnum.Table]: (initValues, parent) => new Table(initValues, parent),
    [ElementEnum.Move]: function (): ICanvasObjectWithId {
        throw new Error("Function not implemented.");
    },
    [ElementEnum.Pan]: function (): ICanvasObjectWithId {
        throw new Error("Function not implemented.");
    }
};
