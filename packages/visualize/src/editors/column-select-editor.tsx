import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@now/ui";
import { ColumnConfig, EditorValue, SingleColumnSelectValue } from "@now/utils";

export const ColumnSelectEditor = function ColumnSelectEditor({
    editorValue,
    option,
    value,
    columns
}: {
    editorValue: EditorValue;
    value: SingleColumnSelectValue;
    option: string;
    columns: ColumnConfig[];
}) {
    const handleChange = (val: string) => {
        const column = columns.find((column) => column.name === val);
        editorValue.onChange({ t: "scs", v: column ?? null });
    };

    return (
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
    );
};
