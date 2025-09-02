import { TableNow } from "@now/ui";
import { TableChart } from "@now/utils";
import { observer } from "mobx-react";
import { CSSProperties } from "react";

export const CutomTable = observer(function CutomTable({ chart, style }: { chart: TableChart; style?: CSSProperties }) {
    const data = chart.ChartData;
    const headers = chart.DimensionColumns.map((c) => c.name).concat(chart.MeasureColumns.map((c) => c.name));
    return (
        <TableNow
            rows={data ?? []}
            columns={headers}
            refetch={() => {
                chart.Page = (chart.Page ?? 0) + 1;
            }}
        />
    );
});
