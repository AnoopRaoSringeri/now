import { BaseObject } from "../base-object";
import { ImageObject } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";

export class Image extends BaseObject {
    object: ImageObject;
    constructor(id: string, object: ImageObject, board: CanvasBoard) {
        super(id, object, board);
        this.object = object;
    }
    getValues(): ImageObject {
        return this.object;
    }
}
