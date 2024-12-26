import { EditorValue, OptionType } from "./editor-value-types";
import { ChartType } from "./types";
import { ValueType } from "./value-types";

interface IChart {
    type: ChartType;
    config: OptionType;
    //columnConfig: ColumnConfig[];
    onChange: (key: keyof OptionType, value: ValueType) => void;
}

export class Chart implements IChart {
    constructor(public config: Record<string, EditorValue>, public type: ChartType) {}
    onChange(key: string, value: ValueType) {
        this.config[key].onChange(value);
    }
}
