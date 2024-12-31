import { Chart } from "../types/visualize/chart";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "./store-provider";
import { useEffect } from "react";

export function useDataLoader(chart: Chart, id: string) {
    const { uploadStore } = useStore();
    const {
        data,
        isLoading: dataLoading,
        refetch
    } = useQuery({
        queryFn: async () => {
            return await uploadStore.GetData({
                id,
                columns: chart.UsedColumns
            });
        },
        queryKey: ["ChartData", id],
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (dataLoading || data == null) {
            return;
        }
        chart.ChartData = data;
        chart.ColumnConfig = data.columns.map((c) => ({ name: c, type: "string" }));
    }, [chart, data, dataLoading]);

    useEffect(() => {
        refetch();
    }, [chart.DataVersion, refetch, chart.UsedColumns]);

    return { chartData: chart.chartData, loading: dataLoading };
}
