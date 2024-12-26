import { ColumnConfig, EditorType } from "./types";
import {
    ValueType,
    MultiSelectValue,
    SingleSelectValue,
    SingleColumnSelectValue,
    MultiColumnSelectValue
} from "./value-types";

export class EditorValue {
    constructor(public editorType: EditorType, public options: ValueType["v"], public value: ValueType) {}
    onChange(value: ValueType) {
        this.value = value;
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
    constructor(public options: ColumnConfig[], value: SingleColumnSelectValue) {
        super("ColumnSelect", options, value);
    }
    onChange(value: SingleColumnSelectValue) {
        this.value = value;
    }
}

export class MultiColumnSelectType extends EditorValue {
    constructor(public options: ColumnConfig[], value: MultiColumnSelectValue) {
        super("MultiColumnSelect", options, value);
    }
    onChange(value: MultiColumnSelectValue) {
        this.value = value;
    }
}

export type OptionType = Record<string, EditorValue>;
