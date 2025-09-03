import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@now/ui";
import { CartesianGrid, Line, LineChart as LineChartComponent, XAxis } from "recharts";
import { ChartRowData, LineChart, LineChartConfig } from "@now/utils";
import { observer } from "mobx-react";

export const LineChartNow = observer(function LineChartNow({ chart }: { chart: LineChart }) {
    const chartData: ChartRowData[] = chart.ChartData.data;
    const config = chart.Config as LineChartConfig;
    const xAxis = config.dimensions.v.v;

    const yAxis = config.measures.v.v;

    if (xAxis == null || yAxis.length === 0) {
        return null;
    }

    const usedColumn = [xAxis, ...yAxis];

    const chartConfig: ChartConfig = {};
    usedColumn.forEach((column) => {
        chartConfig[column.name] = {
            label: column.name,
            color: `#${Math.random().toString(16).substr(-6)}`
        };
    });

    return (
        <ChartContainer config={chartConfig} className="size-full">
            <LineChartComponent accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey={xAxis.name}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                {yAxis.map((v) => (
                    <Line
                        key={v.name}
                        dataKey={v.name}
                        type="linear"
                        stroke={`var(--color-${v.name})`}
                        strokeWidth={2}
                        dot={false}
                    />
                ))}
            </LineChartComponent>
        </ChartContainer>
    );
});
