import { AppLoader } from "@now/ui";
import { ChartData, Chart, useDataLoader, ChartNow } from "@now/utils";
import { ChartFactory, BarChartNow, PieChartNow, CutomTable, LineChartNow } from "@now/visualize";
import { observer } from "mobx-react";

export const ChartsRenderer = observer(function ChartsRenderer({ component }: { component: ChartNow }) {
    const { chart } = component;
    const id = component.id;
    const { chartData, loading } = useDataLoader(chart!, id);

    if (chart == null) {
        return null;
    }

    return (
        <>
            <AppLoader loading={loading} />
            {chartData && chartData.columns.length > 0 ? <ChartRenderer chart={chart} chartData={chartData} /> : null}
        </>
    );
});

const ChartRenderer = observer(function ChartRenderer({ chart, chartData }: { chart: Chart; chartData: ChartData }) {
    const typedChart = ChartFactory.getChartConfig(chart);
    switch (typedChart.type) {
        case "Bar":
            return <BarChartNow chartConfig={typedChart.config} chartData={chart.ChartData} />;
        case "Line":
            return <LineChartNow chartConfig={typedChart.config} chartData={chart.ChartData} />;
        case "Pie":
            return <PieChartNow chartConfig={typedChart.config} chartData={chart.ChartData} />;
        default:
            return <CutomTable data={chartData.data} headers={chartData.columns} />;
    }
});
