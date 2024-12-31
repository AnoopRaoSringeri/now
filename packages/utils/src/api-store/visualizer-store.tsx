import axios, { AxiosResponse } from "axios";
import { BaseUrl, getRequestConfig } from "./auth-store";
import { ChartData } from "../types/visualize/chart-data";
import { ChartDataRequest } from "../types/visualize/requests";

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
