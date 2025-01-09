import { v4 as uuid } from "uuid";

import { CanvasBoard } from "./canvas-board";
import { CanvasActionEnum, ElementEnum } from "../types/sketch-now/enums";
import { CanvasHelper, CANVAS_SCALING_FACTOR, CANVAS_SCALING_LIMIT, CANVAS_SCALING_MULTIPLIER } from "./canvas-helpers";
import { CanvasObjectFactory } from "./canvas-object-factory";
import { CanvasImage } from "../types/canvas/objects/image";
import { Text } from "../types/canvas/objects/text";

export class EventManager {
    private readonly Board: CanvasBoard;
    constructor(canvasBoard: CanvasBoard) {
        this.Board = canvasBoard;
    }

    onMouseDown(e: MouseEvent) {
        if (this.Board.Clicked) {
            return;
        }
        this.Board.Clicked = true;
        if (!this.Board.CanvasCopy) {
            return;
        }
        const context = this.Board.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        if (
            this.Board._selectedElements.length !== 0 &&
            (this.Board.HoveredObject == null || this.Board.HoveredObject.id !== this.Board._selectedElements[0].id) &&
            (this.Board.SelectionElement == null || this.Board._currentCanvasAction === CanvasActionEnum.Select)
        ) {
            this.Board.unSelectElements();
        }
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, this.Board.Transform);
        this.Board.PointerOrigin = { x: offsetX, y: offsetY };
        if (this.Board.ElementType === ElementEnum.Pan || (e.detail === 1 && e.ctrlKey)) {
            this.Board._currentCanvasAction = CanvasActionEnum.Pan;
            this.Board.PointerOrigin = { x: e.offsetX, y: e.offsetY };
        } else if (this.Board.ElementType === ElementEnum.Move) {
            if (e.detail === 1) {
                if (this.Board.HoveredObject) {
                    this.Board.Elements = this.Board.Elements.filter(
                        (e) => CanvasHelper.isCustomElement(e) || e.id !== this.Board.HoveredObject!.id
                    );
                    this.Board.redrawBoard();
                    this.Board.ActiveObjects = [this.Board.HoveredObject];
                    this.Board.SelectedElements = [this.Board.HoveredObject];
                    if (this.Board._currentCanvasAction === CanvasActionEnum.Resize && this.Board.CursorPosition) {
                        this.Board.ActiveObjects.forEach((ao) => {
                            ao.resize(context, { dx: 0, dy: 0 }, this.Board.CursorPosition!, "down");
                        });
                    } else {
                        this.Board.ActiveObjects.forEach((ao) => {
                            ao.move(context, { x: 0, y: 0 }, "down");
                            ao.ShowSelection = true;
                        });
                        this.Board._currentCanvasAction = CanvasActionEnum.Select;
                    }
                } else {
                    this.Board.Helper.clearCanvasArea(context);
                    if (this.Board.SelectionElement) {
                        this.Board.TempSelectionArea = this.Board.SelectionElement;
                        if (this.Board._currentCanvasAction === CanvasActionEnum.Resize) {
                            this.Board.ActiveObjects = this.Board.SelectedElements;
                            this.Board.SelectedElements = [];
                            this.Board.Elements = this.Board.Elements.filter(
                                (e) => CanvasHelper.isCustomElement(e) || !e.IsSelected
                            );
                            this.Board.redrawBoard();
                            this.Board.TempSelectionArea.resize(
                                context,
                                { dx: 0, dy: 0 },
                                this.Board.CursorPosition!,
                                "down",
                                false
                            );
                            this.Board.ActiveObjects.forEach((ele) => {
                                ele.updateValue(context, ele.Value, "down", false);
                            });
                        } else if (this.Board._currentCanvasAction === CanvasActionEnum.Move) {
                            this.Board.ActiveObjects = this.Board.SelectedElements;
                            this.Board.SelectedElements = [];
                            this.Board.Elements = this.Board.Elements.filter(
                                (e) => CanvasHelper.isCustomElement(e) || !e.IsSelected
                            );
                            this.Board.redrawBoard();
                            this.Board.TempSelectionArea.move(context, { x: 0, y: 0 }, "down", false);
                            this.Board.ActiveObjects.forEach((ele) => {
                                ele.move(context, { x: 0, y: 0 }, "down", false);
                            });
                        } else {
                            this.Board.TempSelectionArea.updateValue(
                                context,
                                { x: offsetX, y: offsetY, h: 0, w: 0 },
                                "down"
                            );
                        }
                    } else {
                        this.Board._currentCanvasAction = CanvasActionEnum.Select;
                        // this.Board.TempSelectionArea = CanvasObjectFactory.createObject(
                        //     {
                        //         x: offsetX,
                        //         y: offsetY,
                        //         h: 0,
                        //         w: 0,
                        //         id: `temp-${SELECTION_ELEMENT_ID}`,
                        //         style: SelectionStyle
                        //     },
                        //     this.Board
                        // );
                        this.Board.TempSelectionArea = CanvasObjectFactory.createObject(
                            {
                                type: ElementEnum.Rectangle,
                                value: {
                                    x: offsetX,
                                    y: offsetY,
                                    h: 0,
                                    w: 0
                                }
                            },
                            this.Board
                        );
                        this.Board.TempSelectionArea?.create(context);
                    }
                }
            }
        } else {
            if (this.Board.ElementType === ElementEnum.Text) {
                if (!this.Board.Text) {
                    this.Board.Text = new Text(
                        uuid(),
                        {
                            type: ElementEnum.Text,
                            value: {
                                x: offsetX,
                                y: offsetY,
                                value: ""
                            }
                        },
                        this.Board
                    );
                    this.Board.Text?.create(context);
                }
            } else if (this.Board.ElementType === ElementEnum.Image) {
                this.Board.Image = new CanvasImage(
                    uuid(),
                    {
                        type: ElementEnum.Image,
                        value: {
                            x: offsetX,
                            y: offsetY,
                            h: 0,
                            w: 0,
                            value: ""
                        }
                    },
                    this.Board
                );
                this.Board.Image?.create(context);
            } else {
                const newObj = CanvasObjectFactory.createNewObject(
                    this.Board.ElementType,
                    {
                        x: offsetX,
                        y: offsetY
                    },
                    this.Board
                );
                newObj.create(context);
                this.Board.ActiveObjects.push(newObj);
            }
        }
    }

    onMouseMove(e: MouseEvent) {
        if (!this.Board.CanvasCopy) {
            return;
        }
        const context = this.Board.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, this.Board.Transform);
        if (this.Board.PointerOrigin) {
            const { x, y } = this.Board.PointerOrigin;
            if (this.Board._currentCanvasAction === CanvasActionEnum.Pan) {
                const { offsetX, offsetY } = e;
                const dx = offsetX - x;
                const dy = offsetY - y;
                const { transformX: pe, transformY: pf } = this.Board.Transform;
                this.Board.Transform = { ...this.Board.Transform, transformX: pe + dx, transformY: pf + dy };
                this.Board.PointerOrigin = { x: offsetX, y: offsetY };
                this.Board.redrawBoard();
            } else if (this.Board.ElementType === ElementEnum.Move) {
                if (this.Board.TempSelectionArea) {
                    if (this.Board._currentCanvasAction === CanvasActionEnum.Select) {
                        this.Board.TempSelectionArea.updateValue(
                            context,
                            {
                                ...this.Board.TempSelectionArea.Value,
                                w: offsetX - x,
                                h: offsetY - y
                            },
                            "move"
                        );
                    } else if (this.Board._currentCanvasAction === CanvasActionEnum.Move) {
                        this.Board.Helper.clearCanvasArea(context);
                        this.Board.TempSelectionArea.move(context, { x: offsetX - x, y: offsetY - y }, "move", false);
                        this.Board.ActiveObjects.forEach((ele) => {
                            ele.move(context, { x: offsetX - x, y: offsetY - y }, "move", false);
                        });
                    } else if (
                        this.Board._currentCanvasAction === CanvasActionEnum.Resize &&
                        this.Board.CursorPosition
                    ) {
                        this.Board.Helper.clearCanvasArea(context);
                        const { x: px = 0, y: py = 0, h: ph = 0, w: pw = 0 } = this.Board.TempSelectionArea.Value;
                        const {
                            x: rx = 0,
                            y: ry = 0,
                            h: rh = 0,
                            w: rw = 0
                        } = this.Board.TempSelectionArea.resize(
                            context,
                            { dx: offsetX - x, dy: offsetY - y },
                            this.Board.CursorPosition!,
                            "move",
                            false
                        );
                        const cp = this.Board.Helper.getCursorPosition(
                            { x: offsetX, y: offsetY },
                            this.Board.TempSelectionArea.getValues()
                        );
                        this.Board.ActiveObjects.forEach((ele) => {
                            const { type, value } = ele.getValues();
                            switch (type) {
                                case ElementEnum.AiPrompt:
                                case ElementEnum.Chart:
                                case ElementEnum.Image:
                                case ElementEnum.Rectangle: {
                                    const { x: ex = 0, y: ey = 0, h: eh = 0, w: ew = 0 } = value;
                                    const uh = (eh * rh) / ph;
                                    const uw = (ew * rw) / pw;
                                    let ox = 0;
                                    let oy = 0;
                                    let ux = 0;
                                    let uy = 0;
                                    switch (cp) {
                                        case "br":
                                            ox = ((ex - rx) * rw) / pw;
                                            oy = ((ey - ry) * rh) / ph;
                                            ux = px + ox;
                                            uy = py + oy;
                                            break;
                                        case "tr":
                                        case "tl":
                                        case "bl":
                                            ox = ((ex - px) * rw) / pw;
                                            oy = ((ey - py) * rh) / ph;
                                            ux = rx + ox;
                                            uy = ry + oy;
                                    }
                                    // if (ele.type === ElementEnum.Pencil) {
                                    //     ele.resize(context, { dx: ox, dy: oy }, "m", "move", false);
                                    // } else {
                                    //     ele.update(context, { h: uh, w: uw, x: ux, y: uy, points: [] }, "move", false);
                                    // }
                                    ele.updateValue(context, { h: uh, w: uw, x: ux, y: uy }, "move", false);
                                }
                            }
                        });
                    }
                } else {
                    if (this.Board._currentCanvasAction === CanvasActionEnum.Resize && this.Board.CursorPosition) {
                        this.Board.SelectedElements = [];
                        this.Board.ActiveObjects.forEach((ao) => {
                            ao.resize(
                                context,
                                { dx: offsetX - x, dy: offsetY - y },
                                this.Board.CursorPosition!,
                                "move"
                            );
                        });
                    } else {
                        this.Board._currentCanvasAction = CanvasActionEnum.Move;
                        this.Board.SelectedElements = [];
                        this.Board.ActiveObjects.forEach((ao) => {
                            ao.move(context, { x: offsetX - x, y: offsetY - y }, "move");
                        });
                    }
                }
            } else {
                this.Board.ActiveObjects.forEach((ao) => {
                    ao.updateValue(
                        context,
                        {
                            ...ao.Value,
                            w: offsetX - x,
                            h: offsetY - y,
                            ex: offsetX,
                            ey: offsetY
                        },
                        "move"
                    );
                });
            }
        } else if (this.Board.ElementType === ElementEnum.Move) {
            if (this.Board.SelectionElement) {
                const hovered =
                    this.Board.Helper.isUnderMouse(
                        { x: offsetX, y: offsetY },
                        this.Board.SelectionElement.getValues()
                    ) ||
                    this.Board.Helper.getCursorPosition(
                        { x: offsetX, y: offsetY },
                        this.Board.SelectionElement.getValues()
                    ) !== "m";
                if (hovered) {
                    this.Board.CursorPosition = this.Board.Helper.getCursorPosition(
                        { x: offsetX, y: offsetY },
                        this.Board.SelectionElement.getValues()
                    );
                    if (this.Board.CursorPosition === "m") {
                        this.Board._currentCanvasAction = CanvasActionEnum.Move;
                    } else {
                        this.Board._currentCanvasAction = CanvasActionEnum.Resize;
                    }
                    this.Board.CanvasCopy.style.cursor = CanvasHelper.getCursor(this.Board.CursorPosition);
                    this.Board.TempSelectionArea = this.Board.SelectionElement;
                } else {
                    this.Board.CursorPosition = null;
                    this.Board._currentCanvasAction = CanvasActionEnum.Select;
                    this.Board.CanvasCopy.style.cursor = "default";
                    this.Board.TempSelectionArea = null;
                }
            } else {
                const ele = this.Board.Helper.hoveredElement({ x: offsetX, y: offsetY }, this.Board.Elements);
                if (ele) {
                    this.Board.CursorPosition = this.Board.Helper.getCursorPosition(
                        { x: offsetX, y: offsetY },
                        ele.getValues()
                    );
                    if (this.Board.CursorPosition === "m") {
                        this.Board._currentCanvasAction = CanvasActionEnum.Move;
                    } else {
                        this.Board._currentCanvasAction = CanvasActionEnum.Resize;
                    }
                    this.Board.CanvasCopy.style.cursor = CanvasHelper.getCursor(this.Board.CursorPosition);
                    this.Board.HoveredObject = ele;
                } else {
                    this.Board.CursorPosition = null;
                    this.Board._currentCanvasAction = CanvasActionEnum.Select;
                    this.Board.CanvasCopy.style.cursor = "default";
                    this.Board.HoveredObject = null;
                }
            }
        }
    }

    onMouseUp(e: MouseEvent) {
        if (!this.Board.Clicked) {
            return;
        }
        this.Board.Clicked = false;
        if (!this.Board.CanvasCopy) {
            return;
        }
        const context = this.Board.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        if (!this.Board.PointerOrigin) {
            return;
        }
        const { x, y } = this.Board.PointerOrigin;
        const { offsetX, offsetY } = CanvasHelper.getCurrentMousePosition(e, this.Board.Transform);
        if (this.Board.TempSelectionArea) {
            if (this.Board._currentCanvasAction === CanvasActionEnum.Resize) {
                const { x: px = 0, y: py = 0, h: ph = 0, w: pw = 0 } = this.Board.TempSelectionArea.Value;
                const {
                    x: rx = 0,
                    y: ry = 0,
                    h: rh = 0,
                    w: rw = 0
                } = this.Board.TempSelectionArea.resize(
                    context,
                    { dx: offsetX - x, dy: offsetY - y },
                    this.Board.CursorPosition!,
                    "up"
                );
                const cp = this.Board.Helper.getCursorPosition(
                    { x: offsetX, y: offsetY },

                    this.Board.TempSelectionArea.getValues()
                );
                this.Board.ActiveObjects.forEach((ele) => {
                    const { type, value } = ele.getValues();
                    switch (type) {
                        case ElementEnum.AiPrompt:
                        case ElementEnum.Chart:
                        case ElementEnum.Image:
                        case ElementEnum.Rectangle: {
                            const { x: ex = 0, y: ey = 0, h: eh = 0, w: ew = 0 } = value;
                            const uh = (eh * rh) / ph;
                            const uw = (ew * rw) / pw;
                            let ox = 0;
                            let oy = 0;
                            let ux = 0;
                            let uy = 0;
                            switch (cp) {
                                case "br":
                                    ox = ((ex - rx) * rw) / pw;
                                    oy = ((ey - ry) * rh) / ph;
                                    ux = px + ox;
                                    uy = py + oy;
                                    break;
                                case "tr":
                                case "tl":
                                case "bl":
                                    ox = ((ex - px) * rw) / pw;
                                    oy = ((ey - py) * rh) / ph;
                                    ux = rx + ox;
                                    uy = ry + oy;
                                    break;
                            }
                            ele.updateValue(context, { h: uh, w: uw, x: ux, y: uy }, "up", false);
                        }
                    }
                });
                this.Board.SelectionElement = this.Board.TempSelectionArea;
                context.closePath();
                this.Board.saveBoard();
                return;
            } else if (this.Board._currentCanvasAction === CanvasActionEnum.Move) {
                this.Board.TempSelectionArea.move(context, { x: offsetX - x, y: offsetY - y }, "up");
            } else {
                this.Board.TempSelectionArea.updateValue(
                    context,
                    {
                        ...this.Board.TempSelectionArea.Value,
                        w: offsetX - x,
                        h: offsetY - y
                    },
                    "up"
                );
                const { h = 0, w = 0, x: sax = 0, y: say = 0 } = this.Board.TempSelectionArea.Value;
                this.Board.SelectedElements = CanvasHelper.getElementsInsideArea(
                    { height: h, width: w, x: sax, y: say },
                    this.Board.Elements
                );
                if (this.Board.SelectedElements.length <= 0) {
                    this.Board.PointerOrigin = null;
                    this.Board.unSelectElements();
                    return;
                }
                this.Board._applySelectionStyle = false;
                // Uncomment if individual selection is required
                this.Board.SelectedElements.forEach((ele) => {
                    ele.select({});
                    ele.ShowSelection = false;
                });
                const selectedAreaBoundary = CanvasHelper.getSelectedAreaBoundary(this.Board.SelectedElements);
                this.Board.TempSelectionArea.updateValue(context, selectedAreaBoundary, "up");
                this.Board.TempSelectionArea.draw(context);
                this.Board.TempSelectionArea.select({});
                this.Board.TempSelectionArea.ShowSelection = true;
            }
            this.Board.SelectionElement = this.Board.TempSelectionArea;
        }
        if (this.Board.ActiveObjects.length !== 0) {
            if (this.Board.ElementType === ElementEnum.Move) {
                if (this.Board._currentCanvasAction === CanvasActionEnum.Resize) {
                    this.Board.ActiveObjects.forEach((ao) => {
                        ao.resize(context, { dx: offsetX - x, dy: offsetY - y }, this.Board.CursorPosition!, "up");
                    });
                } else if (this.Board._currentCanvasAction === CanvasActionEnum.Select) {
                    this.Board.ActiveObjects.forEach((ao) => {
                        ao.select({});
                        ao.ShowSelection = true;
                    });
                } else {
                    this.Board.ActiveObjects.forEach((ao) => {
                        ao.move(context, { x: offsetX - x, y: offsetY - y }, "up");
                    });
                }
                // this.Board.ActiveObjects = this.Board.ActiveObjects.filter(
                //     (e) => e.type !== ElementEnum.Chart && e.type !== ElementEnum.AiPrompt
                // );
                this.Board.SelectedElements = this.Board.ActiveObjects;
            } else {
                this.Board.ActiveObjects.forEach((ao) => {
                    ao.updateValue(
                        context,
                        {
                            ...ao.Value,
                            w: offsetX - x,
                            h: offsetY - y
                        },
                        "up"
                    );
                });
            }
            context.closePath();
            this.Board.saveBoard();
        } else {
            this.Board.PointerOrigin = null;
            context.closePath();
            this.Board.redrawBoard();
            this.Board._currentCanvasAction = CanvasActionEnum.Select;
            this.Board.TempSelectionArea = null;
        }
    }

    onWheelAction(e: WheelEvent) {
        const oldX = this.Board.Transform.transformX;
        const oldY = this.Board.Transform.transformY;

        const localX = e.clientX;
        const localY = e.clientY;

        const previousScale = this.Board.Transform.scaleX;
        const newScale = Number(Math.abs(this.Board.Transform.scaleX + e.deltaY * CANVAS_SCALING_FACTOR).toFixed(4));
        const newX = localX - (localX - oldX) * (newScale / previousScale);
        const newY = localY - (localY - oldY) * (newScale / previousScale);
        if (newScale <= CANVAS_SCALING_LIMIT) {
            const newScale = CANVAS_SCALING_LIMIT;
            const newX = localX - (localX - oldX) * (newScale / previousScale);
            const newY = localY - (localY - oldY) * (newScale / previousScale);
            this.Board.Transform = {
                ...this.Board.Transform,
                transformX: newX,
                transformY: newY,
                scaleX: newScale,
                scaleY: newScale
            };
            this.Board.Zoom = newScale * CANVAS_SCALING_MULTIPLIER;
            return;
        }
        if (isNaN(newX) || isNaN(newY) || !isFinite(newX) || !isFinite(newY)) {
            return;
        }
        this.Board.Transform = {
            ...this.Board.Transform,
            transformX: newX,
            transformY: newY,
            scaleX: newScale,
            scaleY: newScale
        };
        this.Board.Zoom = newScale * CANVAS_SCALING_MULTIPLIER;
        this.Board.redrawBoard();
    }

    onTouchStart(e: TouchEvent) {
        if (!this.Board.CanvasCopy) {
            return;
        }
        const context = this.Board.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        if (
            this.Board.SelectedElements.length !== 0 &&
            this.Board.HoveredObject?.id !== this.Board.SelectedElements[0]?.id
        ) {
            this.Board.unSelectElements();
        }
        const { clientX: offsetX, clientY: offsetY } = e.touches[0];
        this.Board.PointerOrigin = { x: offsetX, y: offsetY };
        if (this.Board.ElementType === ElementEnum.Move) {
            const ele = this.Board.Helper.hoveredElement({ x: offsetX, y: offsetY }, this.Board.Elements);
            if (ele) {
                this.Board.Elements = this.Board.Elements.filter((e) => e.id !== ele.id);
                this.Board.redrawBoard();
                this.Board.HoveredObject = ele;
                this.Board.ActiveObjects = [ele];
                this.Board.SelectedElements = [ele];
                this.Board.ActiveObjects[0].move(context, { x: 0, y: 0 }, "down");
            }
        } else {
            const newObj = CanvasObjectFactory.createNewObject(
                this.Board.ElementType,
                {
                    x: offsetX,
                    y: offsetY
                },
                this.Board
            );
            newObj.create(context);
            this.Board.ActiveObjects.push(newObj);
        }
    }

    onTouchMove(e: TouchEvent) {
        if (!this.Board.CanvasCopy) {
            return;
        }
        const context = this.Board.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        const { clientX: offsetX, clientY: offsetY } = e.touches[0];
        if (this.Board.ActiveObjects.length !== 0 && this.Board.PointerOrigin) {
            const { x, y } = this.Board.PointerOrigin;
            if (this.Board.ElementType === ElementEnum.Move) {
                this.Board.ActiveObjects[0].move(context, { x: offsetX - x, y: offsetY - y }, "move");
            } else {
                this.Board.ActiveObjects[0].updateValue(
                    context,
                    {
                        ...this.Board.ActiveObjects[0].Value,
                        w: offsetX - x,
                        h: offsetY - y
                    },
                    "move"
                );
            }
        }
    }

    onTouchEnd(e: TouchEvent) {
        if (!this.Board.CanvasCopy) {
            return;
        }
        const context = this.Board.CanvasCopy.getContext("2d");
        if (!context) {
            return;
        }
        if (this.Board.ActiveObjects.length !== 0) {
            const { clientX: offsetX, clientY: offsetY } = e.changedTouches[0];
            if (this.Board.ActiveObjects.length !== 0 && this.Board.PointerOrigin) {
                const { x, y } = this.Board.PointerOrigin;
                if (this.Board.ElementType === ElementEnum.Move) {
                    this.Board.ActiveObjects[0].move(context, { x: offsetX - x, y: offsetY - y }, "up");
                } else {
                    this.Board.ActiveObjects[0].updateValue(
                        context,
                        { ...this.Board.ActiveObjects[0].Value, w: offsetX - x, h: offsetY - y },
                        "up"
                    );
                }
            }
            context.closePath();
            this.Board.saveBoard();
        } else {
            this.Board.PointerOrigin = null;
            return;
        }
    }
}
