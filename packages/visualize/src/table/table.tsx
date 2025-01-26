import { ScrollArea, ScrollBar, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@now/ui";
import { TableChart } from "@now/utils";
import { observer } from "mobx-react";
import React, { CSSProperties, useMemo } from "react";

export const CutomTable = observer(function CutomTable({ chart, style }: { chart: TableChart; style?: CSSProperties }) {
    const data = chart.ChartData;
    const headers = chart.DimensionColumns.map((c) => c.name).concat(chart.MeasureColumns.map((c) => c.name));
    const rows = useMemo(() => {
        return data.slice(1).map((row, i) => (
            <TableRow key={i}>
                {headers.map((k, i) => (
                    <TableCell key={k + i} className="text-nowrap">
                        {row[k]}
                    </TableCell>
                ))}
            </TableRow>
        ));
    }, [data, headers]);

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
                <TableBody className="size-full overflow-auto">{rows}</TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
            <ScrollBar className="pt-[50px]" orientation="vertical" />
        </ScrollArea>
    );
});

// import { ScrollArea, ScrollBar, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@now/ui";
// import { ChartRowData } from "@now/utils";
// import React, { CSSProperties, useMemo } from "react";

// export const CutomTable = React.memo(function CutomTable({
//     headers,
//     data,
//     style
// }: {
//     headers: string[];
//     data: ChartRowData[];
//     style?: CSSProperties;
// }) {
//     const rows = useMemo(() => {
//         return data.slice(1).map((row, i) => (
//             <TableRow key={i}>
//                 {headers.map((k, i) => (
//                     <TableCell key={k + i} className="text-nowrap">
//                         {row[k]}
//                     </TableCell>
//                 ))}
//             </TableRow>
//         ));
//     }, [data, headers]);

//     return (
//         <ScrollArea className="size-full border border-gray-50/10" style={style}>
//             <Table>
//                 <TableHeader>
//                     <TableRow>
//                         {headers.map((h) => (
//                             <TableHead key={h}>{h}</TableHead>
//                         ))}
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody className="size-full overflow-auto">{rows}</TableBody>
//             </Table>
//             <ScrollBar orientation="horizontal" />
//             <ScrollBar className="pt-[50px]" orientation="vertical" />
//         </ScrollArea>
//     );
// });
