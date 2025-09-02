import { useInViewport } from "@mantine/hooks";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ChartRowData } from "@now/utils";
import React, { CSSProperties, useEffect } from "react";

export const TableNow = function TableNow({
    rows,
    columns,
    style,
    refetch
}: {
    columns: string[];
    rows: ChartRowData[];
    style?: CSSProperties;
    refetch: (() => unknown) | null;
}) {
    const { ref, inViewport } = useInViewport();

    useEffect(() => {
        if (inViewport) {
            refetch?.();
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
                    {rows.map((row, i) => (
                        <TableRow key={i}>
                            {columns.map((k, i) => (
                                <TableCell key={k + i} className="text-nowrap">
                                    {row[k]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {rows.length === 0 ? null : <TableRow key="re-fetch" className="w-full h-5" ref={ref}></TableRow>}
                </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
            <ScrollBar className="pt-[50px]" orientation="vertical" />
        </ScrollArea>
    );
};

// import { ChartRowData } from "@now/utils";
// import React, { useRef, CSSProperties } from "react";
// import {
//     useReactTable,
//     getCoreRowModel,
//     getSortedRowModel,
//     createColumnHelper,
//     flexRender,
//     ColumnSort,
//     Table,
//     Cell,
//     Header,
//     HeaderGroup,
//     Row
// } from "@tanstack/react-table";
// import { useVirtualizer, VirtualItem, Virtualizer } from "@tanstack/react-virtual";

// const columnHelper = createColumnHelper<ChartRowData>();

// export const TableNow = function TableNow({
//     rows,
//     columns,
//     style
// }: {
//     columns: string[];
//     rows: ChartRowData[];
//     style?: CSSProperties;
// }) {
//     const [sorting, setSorting] = React.useState<ColumnSort[]>([]);

//     const table = useReactTable({
//         data: rows,
//         columns: columns.map((c) =>
//             columnHelper.accessor(c, {
//                 header: c,
//                 cell: (info) => info.getValue(),
//                 enableSorting: true
//             })
//         ),
//         state: { sorting },
//         onSortingChange: setSorting,
//         getCoreRowModel: getCoreRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         columnResizeMode: "onChange"
//     });
//     return <TableContainer table={table} />;
// };

// function TableContainer({ table }: { table: Table<ChartRowData> }) {
//     const visibleColumns = table.getVisibleLeafColumns();

//     //The virtualizers need to know the scrollable container element
//     const tableContainerRef = React.useRef<HTMLDivElement>(null);

//     //we are using a slightly different virtualization strategy for columns (compared to virtual rows) in order to support dynamic row heights
//     const columnVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableCellElement>({
//         count: visibleColumns.length,
//         estimateSize: (index) => visibleColumns[index].getSize(), //estimate width of each column for accurate scrollbar dragging
//         getScrollElement: () => tableContainerRef.current,
//         horizontal: true,
//         overscan: 3 //how many columns to render on each side off screen each way (adjust this for performance)
//     });

//     const virtualColumns = columnVirtualizer.getVirtualItems();

//     //different virtualization strategy for columns - instead of absolute and translateY, we add empty columns to the left and right
//     let virtualPaddingLeft: number | undefined;
//     let virtualPaddingRight: number | undefined;

//     if (columnVirtualizer && virtualColumns?.length) {
//         virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
//         virtualPaddingRight = columnVirtualizer.getTotalSize() - (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
//     }

//     return (
//         <div
//             className="container"
//             ref={tableContainerRef}
//             style={{
//                 overflow: "auto", //our scrollable table container
//                 position: "relative", //needed for sticky header
//                 height: "100%" //should be a fixed height
//             }}
//         >
//             {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
//             <table style={{ display: "grid" }}>
//                 <TableHead
//                     columnVirtualizer={columnVirtualizer}
//                     table={table}
//                     virtualPaddingLeft={virtualPaddingLeft}
//                     virtualPaddingRight={virtualPaddingRight}
//                 />
//                 <TableBody
//                     columnVirtualizer={columnVirtualizer}
//                     table={table}
//                     tableContainerRef={tableContainerRef}
//                     virtualPaddingLeft={virtualPaddingLeft}
//                     virtualPaddingRight={virtualPaddingRight}
//                 />
//             </table>
//         </div>
//     );
// }

// interface TableHeadProps {
//     columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>;
//     table: Table<ChartRowData>;
//     virtualPaddingLeft: number | undefined;
//     virtualPaddingRight: number | undefined;
// }

// function TableHead({ columnVirtualizer, table, virtualPaddingLeft, virtualPaddingRight }: TableHeadProps) {
//     return (
//         <thead className="flex sticky top-0 z-10 border-b bg-gray-600  ">
//             {table.getHeaderGroups().map((headerGroup) => (
//                 <TableHeadRow
//                     columnVirtualizer={columnVirtualizer}
//                     headerGroup={headerGroup}
//                     key={headerGroup.id}
//                     virtualPaddingLeft={virtualPaddingLeft}
//                     virtualPaddingRight={virtualPaddingRight}
//                 />
//             ))}
//         </thead>
//     );
// }

// interface TableHeadRowProps {
//     columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>;
//     headerGroup: HeaderGroup<ChartRowData>;
//     virtualPaddingLeft: number | undefined;
//     virtualPaddingRight: number | undefined;
// }

// function TableHeadRow({ columnVirtualizer, headerGroup, virtualPaddingLeft, virtualPaddingRight }: TableHeadRowProps) {
//     const virtualColumns = columnVirtualizer.getVirtualItems();
//     return (
//         <tr key={headerGroup.id} style={{ display: "flex", width: "100%" }}>
//             {virtualPaddingLeft ? (
//                 //fake empty column to the left for virtualization scroll padding
//                 <th style={{ display: "flex", width: virtualPaddingLeft }} />
//             ) : null}
//             {virtualColumns.map((virtualColumn) => {
//                 const header = headerGroup.headers[virtualColumn.index];
//                 return <TableHeadCell key={header.id} header={header} />;
//             })}
//             {virtualPaddingRight ? (
//                 //fake empty column to the right for virtualization scroll padding
//                 <th style={{ display: "flex", width: virtualPaddingRight }} />
//             ) : null}
//         </tr>
//     );
// }

// interface TableHeadCellProps {
//     header: Header<ChartRowData, unknown>;
// }

// function TableHeadCell({ header }: TableHeadCellProps) {
//     return (
//         <th
//             className="border-r font-medium "
//             key={header.id}
//             style={{
//                 display: "flex",
//                 width: header.getSize()
//             }}
//         >
//             <div
//                 {...{
//                     className: header.column.getCanSort() ? "cursor-pointer select-none flex-1" : " flex-1",
//                     onClick: header.column.getToggleSortingHandler()
//                 }}
//             >
//                 {flexRender(header.column.columnDef.header, header.getContext())}
//                 {{
//                     asc: " 🔼",
//                     desc: " 🔽"
//                 }[header.column.getIsSorted() as string] ?? null}
//             </div>
//             {header.column.getCanResize() && (
//                 <div
//                     onMouseDown={header.getResizeHandler()}
//                     onTouchStart={header.getResizeHandler()}
//                     className=" right-0 top-0 h-full w-1 cursor-col-resize select-none"
//                 />
//             )}
//         </th>
//     );
// }

// interface TableBodyProps {
//     columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>;
//     table: Table<ChartRowData>;
//     tableContainerRef: React.RefObject<HTMLDivElement>;
//     virtualPaddingLeft: number | undefined;
//     virtualPaddingRight: number | undefined;
// }

// function TableBody({
//     columnVirtualizer,
//     table,
//     tableContainerRef,
//     virtualPaddingLeft,
//     virtualPaddingRight
// }: TableBodyProps) {
//     const { rows } = table.getRowModel();

//     //dynamic row height virtualization - alternatively you could use a simpler fixed row height strategy without the need for `measureElement`
//     const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
//         count: rows.length,
//         estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
//         getScrollElement: () => tableContainerRef.current,
//         overscan: 5
//     });

//     const virtualRows = rowVirtualizer.getVirtualItems();

//     return (
//         <tbody
//             style={{
//                 display: "grid",
//                 height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
//                 position: "relative" //needed for absolute positioning of rows
//             }}
//         >
//             {virtualRows.map((virtualRow) => {
//                 const row = rows[virtualRow.index] as Row<ChartRowData>;

//                 return (
//                     <TableBodyRow
//                         columnVirtualizer={columnVirtualizer}
//                         key={row.id}
//                         row={row}
//                         rowVirtualizer={rowVirtualizer}
//                         virtualPaddingLeft={virtualPaddingLeft}
//                         virtualPaddingRight={virtualPaddingRight}
//                         virtualRow={virtualRow}
//                     />
//                 );
//             })}
//         </tbody>
//     );
// }

// interface TableBodyRowProps {
//     columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>;
//     row: Row<ChartRowData>;
//     rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
//     virtualPaddingLeft: number | undefined;
//     virtualPaddingRight: number | undefined;
//     virtualRow: VirtualItem;
// }

// function TableBodyRow({
//     columnVirtualizer,
//     row,
//     rowVirtualizer,
//     virtualPaddingLeft,
//     virtualPaddingRight,
//     virtualRow
// }: TableBodyRowProps) {
//     const visibleCells = row.getVisibleCells();
//     const virtualColumns = columnVirtualizer.getVirtualItems();
//     return (
//         <tr
//             data-index={virtualRow.index} //needed for dynamic row height measurement
//             ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
//             key={row.id}
//             className=" border-b"
//             style={{
//                 display: "flex",
//                 position: "absolute",
//                 transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
//                 width: "100%"
//             }}
//         >
//             {virtualPaddingLeft ? (
//                 //fake empty column to the left for virtualization scroll padding
//                 <td style={{ display: "flex", width: virtualPaddingLeft }} />
//             ) : null}
//             {virtualColumns.map((vc) => {
//                 const cell = visibleCells[vc.index];
//                 return <TableBodyCell key={cell.id} cell={cell} />;
//             })}
//             {virtualPaddingRight ? (
//                 //fake empty column to the right for virtualization scroll padding
//                 <td style={{ display: "flex", width: virtualPaddingRight }} />
//             ) : null}
//         </tr>
//     );
// }

// interface TableBodyCellProps {
//     cell: Cell<ChartRowData, unknown>;
// }

// function TableBodyCell({ cell }: TableBodyCellProps) {
//     return (
//         <td
//             key={cell.id}
//             className=" text-sm border-r"
//             style={{
//                 display: "flex",
//                 width: cell.column.getSize()
//             }}
//         >
//             {flexRender(cell.column.columnDef.cell, cell.getContext())}
//         </td>
//     );
// }
