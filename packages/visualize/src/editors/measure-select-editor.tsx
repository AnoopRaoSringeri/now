import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@now/ui";
import { ColumnConfig, EditorValue, MeasureAggregateFun, SingleMeasureSelectValue } from "@now/utils";
import { MeasureAggregateIcon } from "../components/measure-aggregate-icon";

export const MeasureSelectEditor = function MeasureSelectEditor({
    editorValue,
    option,
    value,
    columns
}: {
    editorValue: EditorValue;
    value: SingleMeasureSelectValue;
    option: string;
    columns: ColumnConfig[];
}) {
    const handleChange = (val: string) => {
        const column = columns.find((column) => column.name === val);
        editorValue.onChange({ t: "sms", v: column ? { ...column, fun: MeasureAggregateFun.Sum } : null });
    };

    const handleFunChange = (val: MeasureAggregateFun) => {
        editorValue.onChange({ t: "sms", v: value.v ? { ...value.v, fun: val } : null });
    };

    return (
        <div className="flex flex-row items-center">
            <MeasureAggregateIcon value={value.v ? value.v.fun : MeasureAggregateFun.Sum} onChange={handleFunChange} />
            <Select onValueChange={handleChange} value={value.v?.name}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                    {columns.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                            {c.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
