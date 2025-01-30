import axios, { AxiosResponse } from "axios";
import { BaseUrl, getRequestConfig } from "./auth-store";
import { ChartData, ChartDataUpdateMode } from "../types/visualize/chart-data";
import { ChartDataRequest } from "../types/visualize/requests";
class UploadStore {
    async UploadFile(file: File): Promise<ChartData & { id: string }> {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const { data }: AxiosResponse<ChartData & { id: string }> = await axios.post(`${BaseUrl}upload`, formData, {
                withCredentials: true
            });
            return data;
        } catch (e) {
            return { data: [], columns: [], id: "" };
        }
    }

    async UpdateData(
        file: File,
        id: string,
        mode: ChartDataUpdateMode,
        isFirstRowHeader?: boolean
    ): Promise<ChartData> {
        try {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("mode", mode);
            formData.append("file", file);
            const { data }: AxiosResponse<ChartData> = await axios.post(`${BaseUrl}update`, formData, {
                withCredentials: true,
                params: {
                    isFirstRowHeader
                }
            });
            return data;
        } catch (e) {
            return { data: [], columns: [] };
        }
    }

    async UploadVideo(file: File): Promise<boolean> {
        try {
            const buf = await file.arrayBuffer();
            const items = file.name.split(".");
            const ext = items[items.length - 1];
            const { data }: AxiosResponse<boolean> = await axios.post(`${BaseUrl}upload/video?extension=${ext}`, buf, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return data;
        } catch (e) {
            return false;
        }
    }

    async GetData(request: ChartDataRequest): Promise<ChartData> {
        try {
            const { data }: AxiosResponse<ChartData> = await axios.post(
                `${BaseUrl}data`,
                request,
                getRequestConfig(true)
            );
            return data;
        } catch (e) {
            return { data: [], columns: [] };
        }
    }
}

export default UploadStore;
