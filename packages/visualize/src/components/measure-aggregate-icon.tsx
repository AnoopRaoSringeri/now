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
    PopoverTrigger
} from "@now/ui";
import { AggregationIcons, MeasureAggregateFun } from "@now/utils";
import { useState } from "react";

export function MeasureAggregateIcon({
    value,
    onChange
}: {
    value: MeasureAggregateFun;
    onChange: (val: MeasureAggregateFun) => unknown;
}) {
    const [open, setOpen] = useState(false);
    const Icon = AggregationIcons[value];
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button size="compact" variant="none" className="mr-1" role="combobox" aria-expanded={open}>
                    <Icon />
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
