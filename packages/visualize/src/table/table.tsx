import { ScrollArea, ScrollBar, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@now/ui";
import { ChartRowData } from "@now/utils";
import { CSSProperties } from "react";

export function CutomTable({
    headers,
    data,
    style
}: {
    headers: string[];
    data: ChartRowData[];
    style?: CSSProperties;
}) {
    return (
        <ScrollArea className="size-full border border-gray-50/10" style={style}>
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((h) => (
                            <TableHead key={h}>{h}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody className="size-full overflow-auto">
                    {data.slice(1).map((row, i) => (
                        <TableRow key={i}>
                            {headers.map((k, i) => (
                                <TableCell key={k + i} className="text-nowrap">
                                    {row[k]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
