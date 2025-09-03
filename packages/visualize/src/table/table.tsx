import { TableNow } from "@now/ui";
import { TableChart } from "@now/utils";
import { observer } from "mobx-react";
import { CSSProperties } from "react";

export const CutomTable = observer(function CutomTable({ chart, style }: { chart: TableChart; style?: CSSProperties }) {
    const headers = chart.DimensionColumns.map((c) => c.name).concat(chart.MeasureColumns.map((c) => c.name));
    return (
        <TableNow
            rows={chart.ChartData.data ?? []}
            totalRowCount={chart.ChartData.totalRowCount}
            columns={headers}
            fetchNextPage={() => {
                chart.Page = (chart.Page ?? 0) + 1;
            }}
        />
    );
});
