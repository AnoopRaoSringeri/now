import { BaseObject } from "../base-object";
import { TextObject } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";

export class Text extends BaseObject {
    object: TextObject;
    constructor(id: string, object: TextObject, board: CanvasBoard) {
        super(id, object, board);
        this.object = object;
    }
    get Value() {
        return this.object.value;
    }
    getValues(): TextObject {
        return this.object;
    }
}
