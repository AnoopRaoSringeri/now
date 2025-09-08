import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@now/ui";
import { BarChart, BarChartConfig, ChartRowData } from "@now/utils";
import { observer } from "mobx-react";
import { Bar, BarChart as BarChartComponent, CartesianGrid, XAxis } from "recharts";
import { ChartPaginator } from "../components/chart-paginator";

export const BarChartNow = observer(function BarChartNow({ chart }: { chart: BarChart }) {
    const chartData: ChartRowData[] = chart.ChartData.data;
    const config = chart.Config as BarChartConfig;
    const xAxis = config.dimensions.v.v;

    if (xAxis == null || config.measures.v.v.length === 0) {
        return null;
    }

    const usedColumn = [xAxis, ...config.measures.v.v];

    const chartConfig: ChartConfig = {};
    usedColumn.forEach((column) => {
        chartConfig[column.name] = {
            label: column.name,
            color: `#${Math.random().toString(16).substr(-6)}`
        };
    });

    return (
        <ChartPaginator rowCount={chart.ChartData.data.length}>
            {(paginator) => (
                <ChartContainer config={chartConfig} className="flex-1 overflow-hidden">
                    <BarChartComponent accessibilityLayer data={chartData} throttleDelay={200}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey={xAxis.name} tickLine={false} tickMargin={10} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend />
                        {config.measures.v.v.map((v) => (
                            <Bar key={v.name} dataKey={v.name} fill={`var(--color-${v.name})`} radius={4} />
                        ))}
                        {paginator}
                    </BarChartComponent>
                </ChartContainer>
            )}
        </ChartPaginator>
    );
});
