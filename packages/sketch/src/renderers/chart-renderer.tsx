import { AppLoader } from "@now/ui";
import { Chart, useDataLoader, ChartNow, ChartFactory } from "@now/utils";
import { BarChartNow, PieChartNow, CutomTable, LineChartNow, AreaChartNow } from "@now/visualize";
import { observer } from "mobx-react";

export const ChartsRenderer = observer(function ChartsRenderer({ component }: { component: ChartNow }) {
    const { chart } = component;
    const { columns, loading } = useDataLoader(chart!);

    if (chart == null) {
        return null;
    }

    return (
        <>
            <AppLoader loading={loading} />
            {columns.length > 0 ? <ChartRenderer chart={chart} /> : null}
        </>
    );
});

const ChartRenderer = observer(function ChartRenderer({ chart }: { chart: Chart }) {
    const typedChart = ChartFactory.getChartConfig(chart);
    switch (typedChart.type) {
        case "Bar":
            return <BarChartNow chart={chart} />;
        case "Line":
            return <LineChartNow chart={chart} />;
        case "Area":
            return <AreaChartNow chart={chart} />;
        case "Pie":
            return <PieChartNow chart={chart} />;
        default:
            return <CutomTable chart={chart} />;
    }
});
