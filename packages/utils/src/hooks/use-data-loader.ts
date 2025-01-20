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
            if (chart.Source.id) {
                return await uploadStore.GetData({
                    id: chart.Source.id,
                    measures: chart.MeasureColumns,
                    dimensions: chart.DimensionColumns,
                    columns:
                        chart.MeasureColumns.length > 0 && chart.DimensionColumns.length > 0
                            ? [chart.DimensionColumns[0], chart.MeasureColumns[0]]
                            : []
                });
            } else {
                return { data: [], columns: [] };
            }
        },
        queryKey: ["ChartData", chart.Source.id],
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
    }, [chart.DataVersion, refetch, chart.MeasureColumns, chart.DimensionColumns]);

    return { chartData: chart.chartData, loading: dataLoading };
}
