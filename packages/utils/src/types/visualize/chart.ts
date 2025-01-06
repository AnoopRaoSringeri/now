import { computed, makeObservable, observable, runInAction, toJS } from "mobx";
import {
    ConfigType,
    ColumnSelectEditorValue,
    ChartNowConfig,
    MultiColumnSelectEditorValue
} from "./editor-value-types";
import { ChartConfigMetadata, ChartType, ColumnConfig } from "./types";
import { ValueType } from "./value-types";
import { ChartData } from "./chart-data";
import { ChartSource } from "./source";

interface IChart {
    type: ChartType;
    config: ConfigType;
    columnConfig: ColumnConfig[];
    onChange: (key: string, value: ValueType) => void;
    toJSON: () => ChartMetadata;
}

export type ChartMetadata = {
    type: ChartType;
    source: ChartSource | null;
    options: Record<string, ValueType>;
    config: ChartConfigMetadata;
    columnConfig: ColumnConfig[];
};

export class Chart implements IChart {
    dataVersion = 0;
    columnConfig: ColumnConfig[] = [];
    chartData: ChartData = { data: [], columns: [] };
    options: ChartNowConfig = {};
    source: ChartSource | null = null;
    config: ConfigType;
    constructor(config: ChartConfigMetadata, public type: ChartType) {
        this.config = {
            measures:
                config.measures.t === "s"
                    ? { t: "s", v: new ColumnSelectEditorValue(config.measures.v) }
                    : { t: "m", v: new MultiColumnSelectEditorValue(config.measures.v) },
            dimensions:
                config.dimensions.t === "s"
                    ? { t: "s", v: new ColumnSelectEditorValue(config.dimensions.v) }
                    : { t: "m", v: new MultiColumnSelectEditorValue(config.dimensions.v) }
        };
        makeObservable(this, {
            type: observable,
            config: observable,
            columnConfig: observable,
            dataVersion: observable,
            DataVersion: computed,
            chartData: observable,
            MeasureColumns: computed,
            DimensionColumns: computed
        });
    }
    onChange(key: string, value: ValueType) {
        runInAction(() => {
            this.options[key].onChange(value);
        });
    }
    set Type(chartType: ChartType) {
        runInAction(() => {
            this.type = chartType;
        });
    }
    set ColumnConfig(columns: ColumnConfig[]) {
        runInAction(() => {
            this.columnConfig = columns;
        });
    }
    get DataVersion() {
        return toJS(this.dataVersion);
    }
    set DataVersion(v: number) {
        runInAction(() => {
            this.dataVersion = v;
        });
    }
    get ChartData() {
        return toJS(this.chartData);
    }
    set ChartData(chartData: ChartData) {
        runInAction(() => {
            this.chartData = chartData;
            this.ColumnConfig = chartData.columns.map((c) => ({ name: c, type: "string" }));
        });
    }
    set Measures(value: ChartConfigMetadata["measures"]) {
        runInAction(() => {
            if (value.t === "s" && this.config.measures.t === "s") {
                this.config.measures.v.onChange(value.v);
            } else if (value.t === "m" && this.config.measures.t === "m") {
                this.config.measures.v.onChange(value.v);
            }
        });
    }
    get MeasureColumns() {
        return this.config.measures.t === "s"
            ? this.config.measures.v.Value.v
                ? [this.config.measures.v.Value.v]
                : []
            : this.config.measures.v.Value.v;
    }
    set Dimensions(value: ChartConfigMetadata["dimensions"]["v"]) {
        runInAction(() => {
            if (this.config.dimensions.t === "s" && value.t === "scs") {
                this.config.dimensions.v.onChange(value);
            } else if (value.t === "mcs" && this.config.dimensions.t === "m") {
                this.config.dimensions.v.onChange(value);
            }
        });
    }
    get DimensionColumns() {
        return this.config.dimensions.t === "s"
            ? this.config.dimensions.v.Value.v
                ? [this.config.dimensions.v.Value.v]
                : []
            : this.config.dimensions.v.Value.v;
    }
    get Config() {
        const config: ChartConfigMetadata = {
            measures: {
                t: "s",
                v: {
                    t: "scs",
                    v: null
                }
            },
            dimensions: {
                t: "s",
                v: {
                    t: "scs",
                    v: null
                }
            }
        };
        if (this.config.measures.t === "s") {
            config.measures = { t: "s", v: this.config.measures.v.Value };
        } else {
            config.measures = { t: "m", v: this.config.measures.v.Value };
        }
        if (this.config.dimensions.t === "s") {
            config.dimensions = { t: "s", v: this.config.dimensions.v.Value };
        } else {
            config.dimensions = { t: "m", v: this.config.dimensions.v.Value };
        }
        return config;
    }
    set Config(config: ChartConfigMetadata) {
        runInAction(() => {
            if (config.measures.t === "s") {
                this.config.measures = { t: "s", v: new ColumnSelectEditorValue(config.measures.v) };
            } else {
                this.config.measures = { t: "m", v: new MultiColumnSelectEditorValue(config.measures.v) };
            }
            if (config.dimensions.t === "s") {
                this.config.dimensions = { t: "s", v: new ColumnSelectEditorValue(config.dimensions.v) };
            } else {
                this.config.dimensions = { t: "m", v: new MultiColumnSelectEditorValue(config.dimensions.v) };
            }
        });
    }
    toJSON() {
        const options: Record<string, ValueType> = {};
        Object.keys(this.options).forEach((key) => {
            options[key] = this.options[key].Value;
        });
        return {
            type: this.type,
            source: this.source,
            options,
            config: this.Config,
            columnConfig: this.columnConfig
        };
    }
}
