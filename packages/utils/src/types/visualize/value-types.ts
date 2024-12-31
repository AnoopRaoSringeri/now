import { ColumnConfig } from "./types";

export type SingleSelectValue = { t: "s"; v: string };

export type MultiSelectValue = { t: "ms"; v: string[] };

export type SingleColumnSelectValue = { t: "scs"; v: ColumnConfig | null };

export type MultiColumnSelectValue = { t: "mcs"; v: ColumnConfig[] };

export type ValueType = SingleSelectValue | MultiSelectValue | SingleColumnSelectValue | MultiColumnSelectValue;
