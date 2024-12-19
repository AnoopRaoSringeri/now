import axios, { AxiosResponse } from "axios";
import { BaseUrl, getRequestConfig } from "./auth-store";
import { ChartData } from "../types/visualize/chart-data";

class UploadStore {
    async UploadFile(file: File, id: string): Promise<ChartData> {
        try {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("file", file);
            const { data }: AxiosResponse<ChartData> = await axios.post(`${BaseUrl}upload`, formData, {
                withCredentials: true
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

    async GetData(id: string): Promise<ChartData> {
        try {
            const { data }: AxiosResponse<ChartData> = await axios.get(`${BaseUrl}data/${id}`, getRequestConfig(true));
            return data;
        } catch (e) {
            return { data: [], columns: [] };
        }
    }
}

export default UploadStore;
