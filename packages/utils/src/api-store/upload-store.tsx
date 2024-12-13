import axios, { AxiosResponse } from "axios";
import { BaseUrl, getRequestConfig } from "./auth-store";

class UploadStore {
    async UploadFile(file: File, id: string): Promise<{ data: string[][] }> {
        try {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("file", file);
            const { data }: AxiosResponse<{ data: string[][] }> = await axios.post(`${BaseUrl}upload`, formData, {
                withCredentials: true
            });
            return data;
        } catch (e) {
            return { data: [] };
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

    async GetData(id: string): Promise<{ data: string[][] }> {
        try {
            const { data }: AxiosResponse<{ data: string[][] }> = await axios.get(
                `${BaseUrl}data/${id}`,
                getRequestConfig(true)
            );
            return data;
        } catch (e) {
            return { data: [] };
        }
    }
}

export default UploadStore;
