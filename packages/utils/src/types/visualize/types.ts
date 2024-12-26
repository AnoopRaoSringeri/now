export type ChartType = "Bar" | "Line" | "Area" | "Pie" | "Table";
export type EditorType = "MultiSelect" | "Select" | "ColumnSelect" | "MultiColumnSelect";

export type ColumnType = "string" | "number" | "date";

export type ColumnConfig = {
    name: string;
    type: ColumnType;
};
