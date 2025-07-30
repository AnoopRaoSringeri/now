import { BaseObject } from "../base-object";
import { AiPromptObject } from "../types";
import { CanvasBoard } from "../../../lib/canvas-board";
import { runInAction } from "mobx";
import { IObjectStyle } from "../../sketch-now/object-styles";

export class AiPrompt extends BaseObject {
    object: AiPromptObject;
    prompt = "";
    constructor(id: string, object: AiPromptObject, board: CanvasBoard, style: IObjectStyle) {
        super(id, object, board, style);
        this.object = object;
    }
    get Prompt() {
        return this.object.value.prompt;
    }

    set Prompt(value: string) {
        runInAction(() => {
            this.object.value.prompt = value;
        });
    }
    getValues(): AiPromptObject {
        return this.object;
    }
}
