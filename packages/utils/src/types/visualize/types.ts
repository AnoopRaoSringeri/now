import {
    MultiColumnSelectValue,
    MultiMeasureSelectValue,
    SingleColumnSelectValue,
    SingleMeasureSelectValue
} from "./value-types";

export type ChartType = "Bar" | "Line" | "Area" | "Pie" | "Radar" | "Table";
export type EditorType = "MultiSelect" | "Select" | "ColumnSelect" | "MultiColumnSelect";

export type ColumnType = "string" | "number" | "date";

export type ColumnConfig = {
    name: string;
    type: ColumnType;
};

export enum MeasureAggregateFun {
    Sum = "Sum",
    Average = "Average",
    Max = "Max",
    Min = "Min",
    Count = "Count"
}

export type MeasureConfig = {
    fun: MeasureAggregateFun;
} & ColumnConfig;

export type SortConfig = {
    column: string;
    sort: "ASC" | "DESC";
};

export type ChartConfigMetadata = {
    measures:
        | {
              t: "s";
              v: SingleMeasureSelectValue;
          }
        | {
              t: "m";
              v: MultiMeasureSelectValue;
          };
    dimensions:
        | {
              t: "s";
              v: SingleColumnSelectValue;
          }
        | {
              t: "m";
              v: MultiColumnSelectValue;
          };
};
