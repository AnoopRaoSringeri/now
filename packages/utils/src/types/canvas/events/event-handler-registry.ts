import { CanvasActionEnum, ElementEnum } from "../../sketch-now/enums";
import { IElementEventHandler } from "../element-event-handler";
import { ImageEventHandler } from "./image-handler";
import { CanvasActionHandler } from "./canvas-action-handler";
import { TextEventHandler } from "./text-handler";
import { CanvasElementHandler } from "./canvas-element-handler";

export class EventHandlerRegistry {
    private handlers: Map<ElementEnum, IElementEventHandler> = new Map();
    private canvasActionHandlers: Map<CanvasActionEnum, IElementEventHandler> = new Map();

    constructor() {
        this.handlers.set(ElementEnum.Move, new CanvasActionHandler());
        this.handlers.set(ElementEnum.Image, new ImageEventHandler());
        this.handlers.set(ElementEnum.Text, new TextEventHandler());
        this.handlers.set(ElementEnum.Rectangle, new CanvasElementHandler());
        this.handlers.set(ElementEnum.Square, new CanvasElementHandler());
        this.handlers.set(ElementEnum.Circle, new CanvasElementHandler());
        this.handlers.set(ElementEnum.Pencil, new CanvasElementHandler());
        this.handlers.set(ElementEnum.Line, new CanvasElementHandler());
        this.handlers.set(ElementEnum.Chart, new CanvasElementHandler());
        this.handlers.set(ElementEnum.AiPrompt, new CanvasElementHandler());
    }

    getHandler(type: ElementEnum): IElementEventHandler | undefined {
        return this.handlers.get(type);
    }
}
