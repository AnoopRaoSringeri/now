import { action, computed, makeObservable, observable, runInAction, toJS } from "mobx";
import { createRef } from "react";
import { Position, Size, CanvasMetadata, AdditionalCanvasOptions } from "../types/sketch-now/canvas";
import { ICanvas, CursorPosition, ICanvasTransform } from "../types/sketch-now/custom-canvas";
import { ElementEnum, CanvasActionEnum } from "../types/sketch-now/enums";
import { IObjectStyle } from "../types/sketch-now/object-styles";
import {
    DefaultStyle,
    CanvasHelper,
    CANVAS_SCALING_MULTIPLIER,
    CANVAS_ZOOM_IN_OUT_FACTOR,
    CANVAS_SCALING_LIMIT,
    MIN_INTERVAL
} from "./canvas-helpers";
import { EventManager } from "./event-handler";
import { BaseObject } from "../types/canvas/base-object";
import { Rectangle } from "../types/canvas/objects/rectangle";
import { Text } from "../types/canvas/objects/text";
import { CanvasImage } from "../types/canvas/objects/image";
import { CanvasObjectFactory } from "./canvas-object-factory";
import { AiPrompt } from "../types/canvas/objects/ai-prompt";
import { ChartNow } from "../types/canvas/objects/chart";
import { v4 as uuid } from "uuid";
export class CanvasBoard implements ICanvas {
    private _lastTimestamp = 0;
    private _clicked = false;
    private _canvas: React.RefObject<HTMLCanvasElement>;
    private _canvasCopy: React.RefObject<HTMLCanvasElement>;
    _elements: BaseObject[] = [];
    private _pointerOrigin: Position | null = null;
    private _readOnly = false;
    private _cursorPosition: CursorPosition | null = null;

    _activeObjects: BaseObject[] = [];
    private _hoveredObject: BaseObject | null = null;

    private EventManager: EventManager;

    _elementType: ElementEnum = ElementEnum.Move;
    _isElementSelectorLocked = true;
    _currentCanvasAction: CanvasActionEnum = CanvasActionEnum.Select;
    _zoom = 100;
    _style: IObjectStyle = DefaultStyle;
    _selectedElements: BaseObject[] = [];
    _canvasTransform: ICanvasTransform = CanvasHelper.GetDefaultTransForm();

    TempSelectionArea: Rectangle | null = null;
    _selectionArea: Rectangle | null = null;
    _applySelectionStyle = true;

    Helper: CanvasHelper;

    text: Text | null = null;

    image: CanvasImage | null = null;

    constructor() {
        this.EventManager = new EventManager(this);
        this._canvas = createRef();
        this._canvasCopy = createRef();
        this.Helper = new CanvasHelper(this);
        makeObservable(this, {
            _elementType: observable,
            ElementType: computed,
            _isElementSelectorLocked: observable,
            IsElementSelectorLocked: computed,
            _style: observable,
            Style: computed,
            setStyle: action,
            _selectedElements: observable,
            SelectedElements: computed,
            _zoom: observable,
            Zoom: computed,
            _canvasTransform: observable,
            Transform: computed,
            _selectionArea: observable,
            SelectionElement: computed,
            NewOrder: computed,
            _elements: observable,
            Elements: computed,
            text: observable,
            Text: computed,
            image: observable,
            Image: computed,
            CustomComponentIds: computed,
            getComponent: action,
            _activeObjects: observable
        });
    }

    get Canvas() {
        if (!this._canvas.current) {
            throw new Error("canvas is not initialized");
        }
        return this._canvas.current!;
    }

    get CanvasCopy() {
        if (this.ReadOnly) {
            return null;
        }
        return this._canvasCopy.current!;
    }

    get CanvasRef() {
        return this._canvas;
    }

    get CanvasCopyRef() {
        return this._canvasCopy;
    }

    get ElementType() {
        return this._elementType;
    }

    set ElementType(type: ElementEnum) {
        if (type !== this._elementType) {
            this.Text = null;
            this._elementType = type;
            this._activeObjects = [];
            this.unSelectElements();
            if (this.CanvasCopy) {
                if (type === ElementEnum.Pencil) {
                    this.CanvasCopy.style.cursor = "crosshair";
                } else {
                    this.CanvasCopy.style.cursor = "default";
                }
            }
        }
    }

    get Height() {
        return this.Canvas.height;
    }

    set Height(height: number) {
        this.Canvas.height = height;
        if (this.CanvasCopy) {
            this.CanvasCopy.height = height;
        }
    }

    get Width() {
        return this.Canvas.width;
    }

    set Width(width: number) {
        this.Canvas.width = width;
        if (this.CanvasCopy) {
            this.CanvasCopy.width = width;
        }
    }

    get ReadOnly() {
        return this._readOnly;
    }

    set ReadOnly(value: boolean) {
        this._readOnly = value;
    }

    get Zoom() {
        return this._zoom;
    }

    set Zoom(zoom: number) {
        this._zoom = zoom;
    }

    get Style() {
        return toJS(this._style);
    }

    get SelectedElements() {
        return this._selectedElements;
    }

    set SelectedElements(elements: BaseObject[]) {
        this._selectedElements = elements;
    }

    get Transform() {
        return this._canvasTransform;
    }

    get SelectionElement() {
        return this._selectionArea;
    }

    set SelectionElement(ele: Rectangle | null) {
        this._selectionArea = ele;
    }

    set Transform(transform: ICanvasTransform) {
        this._canvasTransform = transform;
    }

    get ActiveObjects() {
        return this._activeObjects;
    }

    set ActiveObjects(objects: BaseObject[]) {
        this._activeObjects = objects;
    }

    get Elements() {
        return this._elements;
    }

    set Elements(objects: BaseObject[]) {
        this._elements = toJS(objects).sort((a, b) => a.order - b.order);
    }

    get HoveredObject() {
        return this._hoveredObject;
    }

    set HoveredObject(object: BaseObject | null) {
        this._hoveredObject = object;
    }

    get PointerOrigin() {
        return this._pointerOrigin;
    }

    set PointerOrigin(origin: Position | null) {
        this._pointerOrigin = origin;
    }

    get CursorPosition() {
        return this._cursorPosition;
    }

    set CursorPosition(position: CursorPosition | null) {
        this._cursorPosition = position;
    }

    get Clicked() {
        return this._clicked;
    }

    set Clicked(value: boolean) {
        this._clicked = value;
    }

    get IsElementSelectorLocked() {
        return this._isElementSelectorLocked;
    }

    set IsElementSelectorLocked(value: boolean) {
        this._isElementSelectorLocked = value;
    }

    get NewOrder() {
        return this.Elements.length + 1;
    }

    get Text() {
        return this.text;
    }

    set Text(value: Text | null) {
        this.text = value;
    }

    get Image() {
        return this.image;
    }

    set Image(value: CanvasImage | null) {
        this.image = value;
    }

    get CustomComponentIds() {
        return this.Elements.filter(CanvasHelper.isCustomElement).map((a) => a.id);
    }

    getComponent(id: string):
        | {
              type: ElementEnum.AiPrompt;
              component: AiPrompt;
          }
        | {
              type: ElementEnum.Chart;
              component: ChartNow;
          } {
        const component = this.ActiveObjects.find((t) => t.id === id) ?? this.Elements.find((t) => t.id === id)!;
        switch (component.Type) {
            case ElementEnum.AiPrompt:
                return {
                    type: ElementEnum.AiPrompt,
                    component: component as AiPrompt
                };
            default:
                return {
                    type: ElementEnum.Chart,
                    component: component as ChartNow
                };
        }
    }

    updateText(value: string) {
        runInAction(() => {
            if (!this.CanvasCopy || !this.Text) {
                return;
            }
            const context = this.CanvasCopy.getContext("2d");
            if (!context) {
                return;
            }
            this.Text.updateValue(context, { ...this.Text.Value, value }, "down");
            this.PointerOrigin = null;
            this.Elements.push(this.Text);
            this.Text = null;
            this.redrawBoard();
        });
    }

    uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || !this.CanvasCopy) {
            return;
        }
        const ctx = this.CanvasCopy.getContext("2d");
        if (!ctx) {
            return;
        }
        const file = e.target.files[0];
        const reader = new FileReader();
        // Read in the image file as a data URL.
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            this.drawImage(event, ctx);
        };
    }

    drawImage(event: ProgressEvent<FileReader>, ctx: CanvasRenderingContext2D) {
        runInAction(() => {
            if (
                event.target?.readyState === FileReader.DONE &&
                event.target.result &&
                typeof event.target.result === "string"
            ) {
                this.Image?.updateValue(ctx, { ...this.Image.Value, value: event.target.result }, "up");
                this.PointerOrigin = null;
                this.Elements.push(this.Image!);
                this.Image = null;
                this.redrawBoard();
            }
        });
    }

    init({ width, height }: Size) {
        if (!this.CanvasCopy) {
            return;
        }
        this.Canvas.width = this.CanvasCopy.width = width;
        this.Canvas.height = this.CanvasCopy.height = height;
    }

    loadBoard(metadata: CanvasMetadata, { height, readonly, width, draw }: Partial<AdditionalCanvasOptions>) {
        this.ReadOnly = readonly ?? false;
        this.Height = height ?? metadata.size.height;
        this.Width = width ?? metadata.size.width;
        this.Transform = metadata.transform;
        this.Zoom = metadata.transform.scaleX * CANVAS_SCALING_MULTIPLIER;
        const objArray = metadata.elements.map((ele) => {
            return CanvasObjectFactory.createObject(ele.id, ele, this);
        });
        this.Elements = objArray;
        if (draw) {
            this.redrawBoard();
        }
    }

    createBoard({ height = window.innerHeight, width = window.innerWidth }: Partial<AdditionalCanvasOptions>) {
        this.Height = height;
        this.Width = width;
    }

    resizeBoard() {
        this.Canvas.width = window.innerWidth;
        this.Canvas.height = window.innerHeight;
        if (this.CanvasCopy) {
            this.CanvasCopy.width = window.innerWidth;
            this.CanvasCopy.height = window.innerHeight;
        }
        this.redrawBoard();
    }

    setStyle<T extends keyof IObjectStyle>(key: T, value: IObjectStyle[T]) {
        this._style[key] = value;
        if (this.CanvasCopy) {
            const context = this.CanvasCopy.getContext("2d");
            if (context) {
                context.save();
            }
        }
    }

    updateStyle<T extends keyof IObjectStyle>(key: T, value: IObjectStyle[T]) {
        if (this.CanvasCopy) {
            const context = this.CanvasCopy.getContext("2d");
            if (context && this._selectedElements.length > 0) {
                const clearCanvas = this.SelectionElement == null;
                if (!clearCanvas) {
                    this.Helper.clearCanvasArea(context);
                }
                this._selectedElements.forEach((ele) => {
                    ele.updateStyle(context, key, value, clearCanvas);
                });
                if (this.SelectionElement) {
                    this.SelectionElement.ShowSelection = true;
                    this.SelectionElement.select({});
                }
                this.SelectedElements = [...this._selectedElements];
            }
        }
    }

    selectElements() {
        //
    }

    unSelectElements() {
        this.SelectedElements.forEach((ele) => {
            ele.unSelect();
        });
        this.SelectedElements = [];
        this.TempSelectionArea = null;
        this.SelectionElement = null;
        this._applySelectionStyle = true;
        this.redrawBoard();
    }

    removeElement(id: string) {
        this.Elements = this.Elements.filter((e) => e.id !== id);
        this.SelectedElements = [];
        this.redrawBoard();
    }

    removeElements() {
        this.Elements = this.Elements.filter((e) => this.SelectedElements.find((se) => se.id === e.id) == null);
        this.SelectedElements = [];
        this.SelectionElement = null;
        this.redrawBoard();
    }

    copyElement(id: string) {
        runInAction(() => {
            if (!this.CanvasCopy) {
                return;
            }
            const context = this.CanvasCopy.getContext("2d");
            if (!context) {
                return;
            }
            const elementToCopy = this.Elements.find((e) => e.id === id);
            if (elementToCopy) {
                const copyElement = CanvasObjectFactory.createObject(uuid(), elementToCopy.getValues(), this);
                copyElement.move(context, { x: 0, y: 0 }, "down", false);
                copyElement.move(context, { x: 40, y: 40 }, "up", false);
                context.closePath();
                this.Elements.push(copyElement);
                this.SelectedElements = [copyElement];
                this.saveBoard();
            }
        });
    }

    copyElements() {
        if (!this.CanvasCopy) {
            return;
        }
        if (!this.SelectionElement) {
            return;
        }
        const context = this.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        const elementsToCopy = this.Elements.filter((e) => this.SelectedElements.find((se) => se.id === e.id) != null);
        this.Helper.clearCanvasArea(context);
        const copiedItems: BaseObject[] = [];
        elementsToCopy.forEach((ele, i) => {
            const copyElement = CanvasObjectFactory.createObject(uuid(), ele.getValues(), this);
            copyElement.move(context, { x: 0, y: 0 }, "down", false);
            copyElement.move(context, { x: 40, y: 40 }, "up", false);
            copiedItems.push(copyElement);
        });
        context.closePath();

        this.SelectedElements = copiedItems;
        if (this.SelectedElements.length <= 0) {
            this.PointerOrigin = null;
            this.unSelectElements();
            return;
        }
        this._applySelectionStyle = false;
        // Uncomment if individual selection is required
        this.SelectedElements.forEach((ele) => {
            ele.select({});
            ele.ShowSelection = false;
        });
        const selectedAreaBoundary = CanvasHelper.getSelectedAreaBoundary(this.SelectedElements);
        this.SelectionElement.updateValue(context, selectedAreaBoundary, "up");
        this.SelectionElement.draw(context);
        this.SelectionElement.select({});
        this.SelectionElement.ShowSelection = true;
        elementsToCopy.forEach((ele) => {
            ele.unSelect();
        });
        this.ActiveObjects = copiedItems;
        this.saveBoard();
    }

    zoomIn() {
        if (this.CanvasCopy) {
            const contextCopy = this.CanvasCopy.getContext("2d");
            if (contextCopy) {
                this.Helper.clearCanvasArea(contextCopy);
            }
        }
        const context = this.Canvas.getContext("2d");
        if (context) {
            this.Helper.clearCanvasArea(context);
        }
        this.Transform = {
            ...this.Transform,
            scaleX: this.Transform.scaleX + CANVAS_ZOOM_IN_OUT_FACTOR,
            scaleY: this.Transform.scaleY + CANVAS_ZOOM_IN_OUT_FACTOR
        };
        this.Zoom = this.Transform.scaleX * CANVAS_SCALING_MULTIPLIER;
        this.redrawBoard();
    }

    zoomOut() {
        if (this.CanvasCopy) {
            const contextCopy = this.CanvasCopy.getContext("2d");
            if (contextCopy) {
                this.Helper.clearCanvasArea(contextCopy);
            }
        }
        const context = this.Canvas.getContext("2d");
        if (context) {
            this.Helper.clearCanvasArea(context);
        }
        const newScale = Math.max(CANVAS_SCALING_LIMIT, this.Transform.scaleX - CANVAS_ZOOM_IN_OUT_FACTOR);
        this.Transform = {
            ...this.Transform,
            scaleX: newScale,
            scaleY: newScale
        };
        this.Zoom = this.Transform.scaleX * CANVAS_SCALING_MULTIPLIER;
        this.redrawBoard();
    }

    fitToView() {
        if (this.CanvasCopy) {
            const contextCopy = this.CanvasCopy.getContext("2d");
            if (contextCopy) {
                this.Helper.clearCanvasArea(contextCopy);
            }
        }
        const context = this.Canvas.getContext("2d");
        if (context) {
            this.Helper.clearCanvasArea(context);
        }
        this.Transform = CanvasHelper.GetDefaultTransForm();
        this.Zoom = 100;
        this.redrawBoard();
    }

    saveBoard() {
        runInAction(() => {
            if (this._activeObjects.length > 0) {
                if (this.SelectionElement) {
                    this.Elements.push(...this._activeObjects.filter((o) => !CanvasHelper.isCustomElement(o)));
                    this.SelectedElements = this._activeObjects;
                } else {
                    this.Elements.push(
                        ...this._activeObjects.filter(
                            (o) => !CanvasHelper.isCustomElement(o) || this.Elements.find((e) => e.id === o.id) == null
                        )
                    );
                }
            }
            this._pointerOrigin = null;
            this._activeObjects = [];
            // this._hoveredObject = null;
            if (!this._isElementSelectorLocked) {
                this.ElementType = ElementEnum.Move;
            }
            this.redrawBoard();
        });
    }

    redrawBoard() {
        const fId = window.requestAnimationFrame((timestamp) => {
            if (timestamp - this._lastTimestamp >= MIN_INTERVAL) {
                if (this.CanvasCopy) {
                    const contextCopy = this.CanvasCopy.getContext("2d");
                    if (contextCopy) {
                        this.Helper.clearCanvasArea(contextCopy);
                        contextCopy.resetTransform();
                        const { scaleX: a, b, c, scaleY: d, transformX: e, transformY: f } = this.Transform;
                        contextCopy.transform(a, b, c, d, e, f);
                        this.ActiveObjects.forEach((ele) => {
                            ele.draw(contextCopy);
                        });
                        if (this.SelectionElement) {
                            this.SelectionElement.draw(contextCopy);
                        }
                        contextCopy.restore();
                    }
                }
                const context = this.Canvas.getContext("2d");
                if (context) {
                    this.Helper.clearCanvasArea(context);
                    context.resetTransform();
                    const { scaleX: a, b, c, scaleY: d, transformX: e, transformY: f } = this.Transform;
                    context.transform(a, b, c, d, e, f);
                    this.Elements.forEach((ele) => {
                        ele.draw(context);
                    });
                    context.restore();
                }
                this._lastTimestamp = timestamp;
            }
        });

        setTimeout(() => {
            window.cancelAnimationFrame(fId);
        }, 100);
    }

    dispose() {
        this.SelectedElements = [];
        this._activeObjects = [];
        this.ElementType = ElementEnum.Move;
        this.ReadOnly = false;
        this._hoveredObject = null;
        this._currentCanvasAction = CanvasActionEnum.Select;
        this.Transform = CanvasHelper.GetDefaultTransForm();
    }

    toJSON(): CanvasMetadata {
        return {
            elements: [...this.Elements.map((ele) => ele.toJSON())],
            size: { height: this.Height, width: this.Width },
            transform: this.Transform
        };
    }

    toSVG({ height, width }: Size) {
        let svgString = "";
        const sRatio = CanvasHelper.getSizeRatio({ height, width }, { height: this.Height, width: this.Width });
        this.Elements.forEach((ele) => {
            svgString += ele.toSVG(sRatio);
        });
        return `<svg width="${width}" height="${height}" xmlns="http://sketch-now/svg">${svgString}</svg>`;
    }

    onMouseDown(e: MouseEvent) {
        this.EventManager.onMouseDown(e);
    }

    onMouseMove(e: MouseEvent) {
        this.EventManager.onMouseMove(e);
    }

    onMouseUp(e: MouseEvent) {
        this.EventManager.onMouseUp(e);
    }

    onWheelAction(e: WheelEvent) {
        this.EventManager.onWheelAction(e);
    }

    onTouchStart(e: TouchEvent) {
        this.EventManager.onTouchStart(e);
    }

    onTouchMove(e: TouchEvent) {
        this.EventManager.onTouchMove(e);
    }

    onTouchEnd(e: TouchEvent) {
        this.EventManager.onTouchEnd(e);
    }
}
