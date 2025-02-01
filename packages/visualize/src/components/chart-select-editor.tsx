import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@now/ui";
import { ChartType } from "@now/utils";

const CHARTS_OPTIONS: ChartType[] = ["Area", "Bar", "Line", "Pie", "Table"];

export const ChartSelect = function ChartSelect({
    onChange,
    value
}: {
    onChange: (val: ChartType) => unknown;
    value: ChartType;
}) {
    return (
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
                {CHARTS_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                        {c}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
