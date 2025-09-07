import { Chart } from "../types/visualize/chart";
import { useStore } from "./store-provider";
import { useEffect } from "react";
import { QueryKeys, useQueryNow } from "./use-query-now";

export function useDataLoader(chart: Chart, chartId: string) {
    const { uploadStore } = useStore();
    const {
        data,
        isLoading: dataLoading,
        refetch
    } = useQueryNow({
        queryFn: async ({ pageParam }) => {
            if (chart.Source && chart.MeasureColumns.length > 0 && chart.DimensionColumns.length > 0) {
                return await uploadStore.GetData(
                    {
                        id: chart.Source.id,
                        measures: chart.MeasureColumns,
                        dimensions: chart.DimensionColumns,
                        columns: [...chart.DimensionColumns, ...chart.MeasureColumns],
                        sort: chart.SortConfig
                    },
                    chart.Page
                );
            } else {
                return { paginatedData: { data: [], totalRowCount: 0 }, columns: [] };
            }
        },
        queryKey: [QueryKeys.ChartData, chartId]
    });

    useEffect(() => {
        if (data == null || data.paginatedData.data?.length === 0) {
            return;
        }
        chart.ChartData = data.paginatedData;
    }, [chart, data]);

    useEffect(() => {
        chart.SortConfig = chart.SortConfig.filter(
            (sc) => chart.UsedColumns.find((uc) => uc.name === sc.column) != null
        );
        refetch();
    }, [chart.DataVersion, refetch, chart.MeasureColumns, chart.DimensionColumns, chart.Page]);

    return { loading: dataLoading };
}
