import { useInViewport } from "@mantine/hooks";
import { ScrollArea, ScrollBar, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@now/ui";
import { ChartRowData } from "@now/utils";
import React, { CSSProperties, useEffect, useState } from "react";

const MAX_ROWS_PAGE = 100;

export const TableNow = function TableNow({
    rows,
    columns,
    style
}: {
    columns: string[];
    rows: ChartRowData[];
    style?: CSSProperties;
}) {
    const { ref, inViewport } = useInViewport();
    const [pagesLoaded, setPagesLoaded] = useState(1);

    useEffect(() => {
        if (inViewport) {
            setPagesLoaded((pre) => pre + 1);
        }
    }, [inViewport]);

    return (
        <ScrollArea className="size-full border flex border-gray-50/10" style={style}>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((h) => (
                            <TableHead key={h}>{h}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody className="size-full overflow-auto">
                    {rows.slice(0, MAX_ROWS_PAGE * pagesLoaded).map((row, i) => (
                        <TableRow key={i}>
                            {columns.map((k, i) => (
                                <TableCell key={k + i} className="text-nowrap">
                                    {row[k]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {rows.length === 0 ? null : <TableRow key="re-fetch" className="w-full h-1" ref={ref}></TableRow>}
                </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
            <ScrollBar className="pt-[50px]" orientation="vertical" />
        </ScrollArea>
    );
};
