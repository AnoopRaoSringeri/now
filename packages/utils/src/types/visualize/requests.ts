import { ColumnConfig, MeasureConfig, SortConfig } from "./types";

export type ChartDataRequest = {
    id: string;
    measures: MeasureConfig[];
    dimensions: ColumnConfig[];
    columns: ColumnConfig[];
    sort: SortConfig[];
};
