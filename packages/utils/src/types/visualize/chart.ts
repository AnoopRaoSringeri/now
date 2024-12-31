import { computed, makeObservable, observable, runInAction, toJS } from "mobx";
import { OptionType, EditorValue } from "./editor-value-types";
import { ChartType, ColumnConfig } from "./types";
import { ValueType } from "./value-types";
import { ChartData } from "./chart-data";

interface IChart {
    type: ChartType;
    config: OptionType;
    columnConfig: ColumnConfig[];
    onChange: (key: string, value: ValueType) => void;
}

export class Chart implements IChart {
    dataVersion = 0;
    columnConfig: ColumnConfig[] = [];
    chartData: ChartData = { data: [], columns: [] };
    constructor(public config: OptionType, public type: ChartType) {
        Object.keys(config).forEach((key) => {
            config[key] = new EditorValue(config[key].editorType, config[key].options, config[key].value);
        });
        makeObservable(this, {
            type: observable,
            config: observable,
            columnConfig: observable,
            dataVersion: observable,
            DataVersion: computed,
            chartData: observable,
            UsedColumns: computed
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
        return this.chartData;
    }
    set ChartData(chartData: ChartData) {
        runInAction(() => {
            this.chartData = chartData;
        });
    }
    onChange(key: string, value: ValueType) {
        runInAction(() => {
            this.config[key].value = value;
        });
    }
    setOptions(key: string, options: ValueType["v"]) {
        this.config[key].setOptions(options);
    }
    get UsedColumns() {
        const columns: ColumnConfig[] = [];
        Object.keys(this.config).forEach((key) => {
            const configValue = this.config[key].Value;
            if (configValue.t === "mcs") {
                columns.push(...configValue.v);
            } else if (configValue.t === "scs" && configValue.v) {
                columns.push(configValue.v);
            }
        });
        return columns;
    }
}
