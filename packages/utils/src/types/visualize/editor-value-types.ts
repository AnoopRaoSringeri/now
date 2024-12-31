import { action, computed, makeObservable, observable, runInAction, toJS } from "mobx";
import { ColumnConfig, EditorType } from "./types";
import {
    ValueType,
    MultiSelectValue,
    SingleSelectValue,
    SingleColumnSelectValue,
    MultiColumnSelectValue
} from "./value-types";

export class EditorValue {
    constructor(public editorType: EditorType, public options: ValueType["v"], public value: ValueType) {
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
    constructor(public editorType: EditorType, public options: ValueType["v"], public value: T) {
        makeObservable(
            this,
            {
                value: observable,
                onChange: action,
                setOptions: action,
                Value: computed
            },
            { deep: true }
        );
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

export class MultiSelectType extends EditorValue {
    constructor(public options: string[], value: MultiSelectValue) {
        super("MultiSelect", options, value);
    }
    onChange(value: MultiSelectValue) {
        this.value = value;
    }
}

export class SelectType extends EditorValue {
    constructor(public options: string[], value: SingleSelectValue) {
        super("Select", options, value);
    }
    onChange(value: SingleSelectValue) {
        this.value = value;
    }
}

export class ColumnSelectType extends EditorValue {
    valueType: SingleColumnSelectValue;
    constructor(public options: ColumnConfig[], value: SingleColumnSelectValue) {
        super("ColumnSelect", options, value);
        this.valueType = value;
    }
    onChange(value: SingleColumnSelectValue) {
        this.value = value;
    }
    get Value(): SingleColumnSelectValue {
        return toJS(this.valueType);
    }
    getValue(): SingleColumnSelectValue["v"] {
        return toJS(this.valueType["v"]);
    }
}

export class MultiColumnSelectType extends EditorValue {
    valueType: MultiColumnSelectValue;
    constructor(public options: ColumnConfig[], value: MultiColumnSelectValue) {
        super("MultiColumnSelect", options, value);
        this.valueType = value;
    }
    onChange(value: MultiColumnSelectValue) {
        this.value = value;
    }
    get Value(): MultiColumnSelectValue {
        return toJS(this.valueType);
    }
    getValue(): MultiColumnSelectValue["v"] {
        return toJS(this.valueType["v"]);
    }
}

export type OptionType = Record<string, EditorValue>;
