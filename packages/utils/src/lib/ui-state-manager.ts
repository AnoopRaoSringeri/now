import { makeAutoObservable, runInAction } from "mobx";
import { CanvasBoard } from "./canvas-board";
import React from "react";
import {
    CANVAS_ZOOM_IN_OUT_FACTOR,
    CANVAS_SCALING_MULTIPLIER,
    CANVAS_SCALING_LIMIT,
    CanvasHelper
} from "./canvas-helpers";
import { ElementEnum } from "../types/sketch-now/enums";

export class UiStateManager {
    private readonly Board: CanvasBoard;
    private boardContainerRef: React.RefObject<HTMLDivElement>;
    private _isFullScreen = false;
    constructor(canvasBoard: CanvasBoard) {
        this.Board = canvasBoard;
        this.boardContainerRef = React.createRef();
        makeAutoObservable(this);
    }
    boardName = "";

    get BoardName() {
        return this.boardName;
    }

    set BoardName(name: string) {
        runInAction(() => {
            this.boardName = name;
        });
    }

    get BoardContainerRef() {
        return this.boardContainerRef;
    }

    get HideCustomizationPanel() {
        if (this.Board.ElementType === ElementEnum.Move || this.Board.ElementType === ElementEnum.Pan) {
            return this.Board.SelectedElements.length === 0;
        } else if (this.Board.ElementType === ElementEnum.Chart || this.Board.ElementType === ElementEnum.Image) {
            return this.Board.SelectedElements.length === 0;
        } else if (this.Board.ElementType === ElementEnum.AiPrompt) {
            return true;
        } else {
            return false;
        }
    }

    toggleFullScreen() {
        this._isFullScreen = !this._isFullScreen;
        if (this._isFullScreen) {
            this.BoardContainerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    zoomIn() {
        if (this.Board.CanvasCopy) {
            const contextCopy = this.Board.CanvasCopy.getContext("2d");
            if (contextCopy) {
                this.Board.Helper.clearCanvasArea(contextCopy);
            }
        }
        const context = this.Board.Canvas.getContext("2d");
        if (context) {
            this.Board.Helper.clearCanvasArea(context);
        }
        this.Board.Transform = {
            ...this.Board.Transform,
            scaleX: this.Board.Transform.scaleX + CANVAS_ZOOM_IN_OUT_FACTOR,
            scaleY: this.Board.Transform.scaleY + CANVAS_ZOOM_IN_OUT_FACTOR
        };
        this.Board.Zoom = this.Board.Transform.scaleX * CANVAS_SCALING_MULTIPLIER;
        this.Board.redrawBoard();
    }

    zoomOut() {
        if (this.Board.CanvasCopy) {
            const contextCopy = this.Board.CanvasCopy.getContext("2d");
            if (contextCopy) {
                this.Board.Helper.clearCanvasArea(contextCopy);
            }
        }
        const context = this.Board.Canvas.getContext("2d");
        if (context) {
            this.Board.Helper.clearCanvasArea(context);
        }
        const newScale = Math.max(CANVAS_SCALING_LIMIT, this.Board.Transform.scaleX - CANVAS_ZOOM_IN_OUT_FACTOR);
        this.Board.Transform = {
            ...this.Board.Transform,
            scaleX: newScale,
            scaleY: newScale
        };
        this.Board.Zoom = this.Board.Transform.scaleX * CANVAS_SCALING_MULTIPLIER;
        this.Board.redrawBoard();
    }

    fitToView() {
        if (this.Board.CanvasCopy) {
            const contextCopy = this.Board.CanvasCopy.getContext("2d");
            if (contextCopy) {
                this.Board.Helper.clearCanvasArea(contextCopy);
            }
        }
        const context = this.Board.Canvas.getContext("2d");
        if (context) {
            this.Board.Helper.clearCanvasArea(context);
        }
        this.Board.Transform = CanvasHelper.GetDefaultTransForm();
        this.Board.Zoom = 100;
        this.Board.redrawBoard();
    }
}
