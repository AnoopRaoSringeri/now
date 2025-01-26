import { Chart } from "../types/visualize/chart";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "./store-provider";
import { useEffect } from "react";

export function useDataLoader(chart: Chart) {
    const { uploadStore } = useStore();
    const {
        data,
        isLoading: dataLoading,
        refetch
    } = useQuery({
        queryFn: async () => {
            if (chart.Source && chart.MeasureColumns.length > 0 && chart.DimensionColumns.length > 0) {
                return await uploadStore.GetData({
                    id: chart.Source.id,
                    measures: chart.MeasureColumns,
                    dimensions: chart.DimensionColumns,
                    columns: [chart.DimensionColumns[0], chart.MeasureColumns[0]]
                });
            } else {
                return { data: [], columns: [] };
            }
        },
        queryKey: ["ChartData", chart.Source?.id],
        refetchOnMount: false,
        // refetchOnReconnect: false,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (data == null || data.data.length === 0) {
            return;
        }
        chart.ChartData = data.data;
    }, [chart, data]);

    useEffect(() => {
        refetch();
    }, [chart.DataVersion, refetch, chart.MeasureColumns, chart.DimensionColumns]);

    return { loading: dataLoading };
}
