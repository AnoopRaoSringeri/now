export type ChartRowData = Record<string, string>;

export type ChartData = { data: ChartRowData[]; columns: string[] };

export type ChartDataUpdateRequest = {
    id: string;
    mode: ChartDataUpdateMode;
};

export type ChartDataUpdateMode = "truncate" | "insert" | "update";
