import { computed, makeObservable, observable, runInAction, toJS } from "mobx";
import {
    ConfigType,
    ColumnSelectEditorValue,
    ChartNowConfig,
    MultiColumnSelectEditorValue
} from "./editor-value-types";
import { ChartConfigMetadata, ChartType } from "./types";
import { ValueType } from "./value-types";
import { ChartRowData } from "./chart-data";
import { ChartSource } from "./source";
import { ChartFactory } from "./chart-factory";

interface IChart {
    type: ChartType;
    config: ConfigType;
    onChange: (key: string, value: ValueType) => void;
    toJSON: () => ChartMetadata;
}

export type ChartMetadata = {
    type: ChartType;
    source: ChartSource | null;
    options: Record<string, ValueType>;
    config: ChartConfigMetadata;
};

export class Chart implements IChart {
    dataVersion = 0;
    chartData: ChartRowData[] = [];
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
            dataVersion: observable,
            chartData: observable,
            source: observable,
            Source: computed,
            DataVersion: computed,
            MeasureColumns: computed,
            DimensionColumns: computed,
            Config: computed
        });
    }
    onChange(key: string, value: ValueType) {
        runInAction(() => {
            this.options[key].onChange(value);
        });
    }
    get Type() {
        return this.type;
    }
    set Type(chartType: ChartType) {
        runInAction(() => {
            this.Config = ChartFactory.convertChartConfig(this.Config, chartType);
            this.type = chartType;
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
    set ChartData(chartData: ChartRowData[]) {
        runInAction(() => {
            this.chartData = chartData;
        });
    }
    get Source() {
        return toJS(this.source);
    }
    set Source(source: ChartSource | null) {
        runInAction(() => {
            this.source = source;
        });
    }
    get ColumnConfig() {
        return this.Source ? this.Source.columns : [];
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
    get IsConfigured() {
        return this.DimensionColumns.length > 0 && this.MeasureColumns.length > 0;
    }
    resetConfig() {
        runInAction(() => {
            if (this.config.measures.t === "s") {
                this.config.measures = { t: "s", v: new ColumnSelectEditorValue({ t: "scs", v: null }) };
            } else {
                this.config.measures = { t: "m", v: new MultiColumnSelectEditorValue({ t: "mcs", v: [] }) };
            }
            if (this.config.dimensions.t === "s") {
                this.config.dimensions = { t: "s", v: new ColumnSelectEditorValue({ t: "scs", v: null }) };
            } else {
                this.config.dimensions = { t: "m", v: new MultiColumnSelectEditorValue({ t: "mcs", v: [] }) };
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
            config: this.Config
        };
    }
}
