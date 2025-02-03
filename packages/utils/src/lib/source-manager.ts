import { makeAutoObservable, runInAction, toJS } from "mobx";
import { ChartSource } from "../types/visualize/source";
import { CanvasBoard } from "./canvas-board";
import { ChartNow } from "../types/canvas/objects/chart";

export class SourceManager {
    sources: ChartSource[] = [];
    private readonly Board: CanvasBoard;
    constructor(canvasBoard: CanvasBoard) {
        this.Board = canvasBoard;
        makeAutoObservable(this);
    }

    get Sources() {
        return toJS(this.sources);
    }

    set Sources(sources: ChartSource[]) {
        runInAction(() => {
            this.sources = sources;
        });
    }

    addSource(source: ChartSource) {
        this.sources.push(source);
    }

    removeSource(id: string) {
        runInAction(() => {
            this.sources = this.sources.filter((source) => source.id !== id);
        });
    }

    refreshLinkedElements() {
        runInAction(() => {
            this.Board.Elements.forEach((element) => {
                if (element instanceof ChartNow) {
                    element.chart.DataVersion++;
                }
            });
        });
    }

    get SelectedSource() {
        const selectedElement = this.Board.SelectedElements[0];
        if (selectedElement && selectedElement instanceof ChartNow) {
            return toJS(selectedElement.chart.Source);
        } else {
            return null;
        }
    }

    set SelectedSource(source: ChartSource | null) {
        runInAction(() => {
            const selectedElement = this.Board.SelectedElements[0];
            if (selectedElement && selectedElement instanceof ChartNow) {
                if (selectedElement.chart.Source?.id === source?.id) {
                    return;
                }
                selectedElement.chart.Source = source;
                selectedElement.chart.resetConfig();
            }
        });
    }
}
