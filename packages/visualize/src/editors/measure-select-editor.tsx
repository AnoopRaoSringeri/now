import {
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@now/ui";
import { ColumnConfig, EditorValue, MeasureAggregateFun, SingleMeasureSelectValue } from "@now/utils";
import { useState } from "react";

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
        <div className="flex flex-row">
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

function MeasureAggregateIcon({
    value,
    onChange
}: {
    value: MeasureAggregateFun;
    onChange: (val: MeasureAggregateFun) => unknown;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    // className="w-[200px] justify-between"
                >
                    {value}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {Object.values(MeasureAggregateFun).map((fun) => (
                                <CommandItem
                                    key={fun}
                                    value={fun.toString()}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue as MeasureAggregateFun);
                                        setOpen(false);
                                    }}
                                >
                                    {fun}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
