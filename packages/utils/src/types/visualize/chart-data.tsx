import { ColumnConfig } from "./types";

export type ChartRowData = Record<string, string>;

export type PaginatedData = { totalRowCount: number; data: ChartRowData[] };

export type ChartData = { paginatedData: PaginatedData; columns: ColumnConfig[] };

export type ChartDataUpdateRequest = {
    id: string;
    mode: ChartDataUpdateMode;
};

export type ChartDataUpdateMode = "truncate" | "insert" | "update";
