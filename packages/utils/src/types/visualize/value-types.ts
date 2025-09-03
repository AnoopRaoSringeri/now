import { ColumnConfig, MeasureConfig } from "./types";

export type SingleSelectValue = { t: "s"; v: string };

export type MultiSelectValue = { t: "ms"; v: string[] };

export type SingleColumnSelectValue = { t: "scs"; v: ColumnConfig | null };

export type MultiColumnSelectValue = { t: "mcs"; v: ColumnConfig[] };

export type SingleMeasureSelectValue = { t: "sms"; v: MeasureConfig | null };

export type MultiMeasureSelectValue = { t: "mms"; v: MeasureConfig[] };

export type ValueType =
    | SingleSelectValue
    | MultiSelectValue
    | SingleColumnSelectValue
    | MultiColumnSelectValue
    | SingleMeasureSelectValue
    | MultiMeasureSelectValue;
