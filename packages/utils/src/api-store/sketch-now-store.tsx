import axios, { AxiosResponse } from "axios";
import { makeAutoObservable } from "mobx";
import { CanvasMetadata, SavedCanvas } from "../../../utils/src/types/sketch-now/canvas";
import { BaseUrl, getRequestConfig } from "./auth-store";
import { ChartRowData } from "../types/visualize/chart-data";

class SketchStore {
    constructor() {
        makeAutoObservable(this);
    }

    async GetAllSketches(): Promise<SavedCanvas[]> {
        try {
            const { data }: AxiosResponse<SavedCanvas[]> = await axios.get(
                `${BaseUrl}sketches`,
                getRequestConfig(true)
            );
            return data;
        } catch (e) {
            return [];
        }
    }

    async GetSketchById(id: string): Promise<SavedCanvas | null> {
        try {
            const { data }: AxiosResponse<SavedCanvas> = await axios.get(
                `${BaseUrl}sketch/${id}`,
                getRequestConfig(true)
            );
            return data;
        } catch (e) {
            return null;
        }
    }

    async SaveSketch(sketchMetadata: CanvasMetadata, name: string, dataUrl: string): Promise<SavedCanvas | null> {
        try {
            const { data }: AxiosResponse<SavedCanvas> = await axios.post(
                `${BaseUrl}create`,
                { name, metadata: sketchMetadata, dataUrl },
                getRequestConfig(true)
            );
            return data;
        } catch (e) {
            return null;
        }
    }

    async UpdateSketch(id: string, sketchMetadata: CanvasMetadata, name: string, dataUrl: string): Promise<boolean> {
        try {
            await axios.post(
                `${BaseUrl}update/${id}`,
                { name, metadata: sketchMetadata, dataUrl },
                getRequestConfig(true)
            );
            return true;
        } catch (e) {
            return false;
        }
    }

    async DeleteSketch(id: string): Promise<boolean> {
        try {
            await axios.delete(`${BaseUrl}delete/${id}`, getRequestConfig(true));
            return true;
        } catch (e) {
            return false;
        }
    }

    async GetSourceData(id: string): Promise<ChartRowData[]> {
        try {
            const { data }: AxiosResponse<ChartRowData[]> = await axios.get(
                `${BaseUrl}sourceData/${id}`,
                getRequestConfig(true)
            );
            return data;
        } catch (e) {
            return [];
        }
    }

    async GetImageData(id: string): Promise<string | null> {
        try {
            const { data }: AxiosResponse<string> = await axios.get(
                `${BaseUrl}imageData/${id}`,
                getRequestConfig(true)
            );
            return data;
        } catch (e) {
            return null;
        }
    }
}

export default SketchStore;
