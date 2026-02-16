import { action, computed, makeObservable, observable, runInAction, toJS } from "mobx";
import {
    MultiColumnSelectValue,
    MultiMeasureSelectValue,
    MultiSelectValue,
    SingleColumnSelectValue,
    SingleMeasureSelectValue,
    SingleSelectValue,
    ValueType
} from "./value-types";

export class EditorValue {
    options: ValueType["v"] | null = null;
    constructor(public value: ValueType) {
        makeObservable(this, {
            value: observable,
            onChange: action,
            setOptions: action,
            Value: computed
        });
    }
    get Value(): ValueType {
        return toJS(this.value);
    }
    getValue(): ValueType["v"] {
        return toJS(this.value["v"]);
    }
    onChange(value: ValueType) {
        runInAction(() => {
            this.value = value;
        });
    }
    setOptions(options: ValueType["v"]) {
        this.options = options;
    }
}

export class EditorValueExtended<T extends ValueType> {
    options: T["v"] = null;
    constructor(public value: T) {
        makeObservable(this, {
            value: observable,
            onChange: action,
            setOptions: action,
            Value: computed
        });
    }
    get Value(): T {
        return toJS(this.value);
    }
    getValue(): T["v"] {
        return toJS(this.value["v"]);
    }
    onChange(value: T) {
        runInAction(() => {
            this.value = value;
        });
    }
    setOptions(options: T["v"]) {
        this.options = options;
    }
}

export class MultiSelectEditorValue extends EditorValue {
    constructor(public options: string[], value: MultiSelectValue) {
        super(value);
    }
    onChange(value: MultiSelectValue) {
        this.value = value;
    }
}

export class SelectEditorValue extends EditorValue {
    constructor(public options: string[], value: SingleSelectValue) {
        super(value);
    }
    onChange(value: SingleSelectValue) {
        this.value = value;
    }
}

export class ColumnSelectEditorValue extends EditorValue {
    value: SingleColumnSelectValue;
    constructor(value: SingleColumnSelectValue) {
        super(value);
        this.value = value;
    }
    onChange(value: SingleColumnSelectValue) {
        this.value = value;
    }
    get Value(): SingleColumnSelectValue {
        return toJS(this.value);
    }
    getValue(): SingleColumnSelectValue["v"] {
        return toJS(this.value["v"]);
    }
}

export class MultiColumnSelectEditorValue extends EditorValue {
    value: MultiColumnSelectValue;
    constructor(value: MultiColumnSelectValue) {
        super(value);
        this.value = value;
    }
    onChange(value: MultiColumnSelectValue) {
        this.value = value;
    }
    get Value(): MultiColumnSelectValue {
        return toJS(this.value);
    }
    getValue(): MultiColumnSelectValue["v"] {
        return toJS(this.value["v"]);
    }
}

export class MeasureSelectEditorValue extends EditorValue {
    value: SingleMeasureSelectValue;
    constructor(value: SingleMeasureSelectValue) {
        super(value);
        this.value = value;
    }
    onChange(value: SingleMeasureSelectValue) {
        this.value = value;
    }
    get Value(): SingleMeasureSelectValue {
        return toJS(this.value);
    }
    getValue(): SingleMeasureSelectValue["v"] {
        return toJS(this.value["v"]);
    }
}

export class MultiMeasureSelectEditorValue extends EditorValue {
    value: MultiMeasureSelectValue;
    constructor(value: MultiMeasureSelectValue) {
        super(value);
        this.value = value;
    }
    onChange(value: MultiMeasureSelectValue) {
        this.value = value;
    }
    get Value(): MultiMeasureSelectValue {
        return toJS(this.value);
    }
    getValue(): MultiMeasureSelectValue["v"] {
        return toJS(this.value["v"]);
    }
}

export type ChartNowConfig = Record<string, EditorValueExtended<ValueType>>;

export type ConfigType = {
    measures:
        | {
              t: "s";
              v: MeasureSelectEditorValue;
          }
        | {
              t: "m";
              v: MultiMeasureSelectEditorValue;
          };
    dimensions:
        | {
              t: "s";
              v: ColumnSelectEditorValue;
          }
        | {
              t: "m";
              v: MultiColumnSelectEditorValue;
          };
};
