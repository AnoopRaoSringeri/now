import { MultiSelect } from "@now/ui";
import { ColumnConfig, EditorValue, MultiColumnSelectValue } from "@now/utils";
import { observer } from "mobx-react";

export const MultiColumnSelectEditor = observer(function MultiColumnSelectEditor({
    editorValue,
    option,
    value,
    columns
}: {
    editorValue: EditorValue;
    value: MultiColumnSelectValue;
    option: string;
    columns: ColumnConfig[];
}) {
    const handleChange = (val: string[]) => {
        const selectedColumns = columns.filter((v) => val.includes(v.name));
        editorValue.onChange({ t: "mcs", v: selectedColumns });
    };

    return (
        <MultiSelect
            className="w-full"
            options={columns.map((c) => ({ label: c.name, value: c.name }))}
            onValueChange={handleChange}
            defaultValue={value.v.map((v) => v.name)}
            placeholder="Select column"
            variant="none"
            maxCount={3}
        />
    );
});
