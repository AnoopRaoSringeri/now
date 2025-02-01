import { useQuery, UseQueryOptions, DefaultError } from "@tanstack/react-query";

export enum QueryKeys {
    Sketch = "Sketch",
    ChartData = "ChartData",
    SketchImageData = "SketchImageData",
    SketchList = "SketchList",
    SourceData = "SourceData"
}

export type QueryKey = [QueryKeys] | [QueryKeys, string | number];

export function useQueryNow<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
    return useQuery(options);
}
