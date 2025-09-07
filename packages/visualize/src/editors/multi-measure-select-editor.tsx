import { MultiSelect } from "@now/ui";
import { EditorValue, ColumnConfig, MultiMeasureSelectValue, MeasureConfig, MeasureAggregateFun } from "@now/utils";
import { observer } from "mobx-react";
import { MeasureAggregateIcon } from "../components/measure-aggregate-icon";

export const MultiMeasureSelectEditor = observer(function MultiMeasureSelectEditor({
    editorValue,
    option,
    value,
    columns
}: {
    editorValue: EditorValue;
    value: MultiMeasureSelectValue;
    option: string;
    columns: ColumnConfig[];
}) {
    const handleChange = (val: string[]) => {
        const selectedColumns = columns.filter((v) => val.includes(v.name));
        const updatedValues: MeasureConfig[] = [];
        selectedColumns.forEach((c) => {
            const existing = value.v.find((mv) => mv.name === c.name);
            if (existing) {
                updatedValues.push(existing);
            } else {
                updatedValues.push({
                    ...c,
                    fun: MeasureAggregateFun.Sum
                });
            }
        });
        editorValue.onChange({ t: "mms", v: updatedValues });
    };

    const handleFunChange = (val: MeasureAggregateFun, measure: string) => {
        editorValue.onChange({ t: "mms", v: value.v.map((v) => ({ ...v, fun: v.name === measure ? val : v.fun })) });
    };

    return (
        <MultiSelect
            className="w-full"
            responsive={false}
            options={columns.map((c) => ({
                label: c.name,
                value: c.name,
                component: (
                    <MeasureAggregateIcon
                        onChange={(v) => handleFunChange(v, c.name)}
                        value={value.v.find((v) => v.name === c.name)?.fun ?? MeasureAggregateFun.Sum}
                    />
                )
            }))}
            onValueChange={handleChange}
            defaultValue={value.v.map((v) => v.name)}
            placeholder="Select column"
            variant="none"
            maxCount={10}
        />
    );
});
