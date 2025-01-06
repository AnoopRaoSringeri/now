import { ColumnConfig } from "./types";

export type ChartDataRequest = {
    id: string;
    measures: ColumnConfig[];
    dimensions: ColumnConfig[];
    columns: ColumnConfig[];
};
