import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@now/ui";
import { EditorValue, SingleSelectValue } from "@now/utils";

export const SelectEditor = function SelectEditor({
    editorValue,
    option,
    value
}: {
    editorValue: EditorValue;
    value: SingleSelectValue;
    option: string;
}) {
    const handleChange = (val: string) => {
        editorValue.onChange({ t: "s", v: val });
    };

    return (
        <Select onValueChange={handleChange} value={value.v}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
                {(editorValue.options as string[]).map((c) => (
                    <SelectItem key={c} value={c}>
                        {c}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
