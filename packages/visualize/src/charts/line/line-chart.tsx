import {
    ChartConfig,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    CardFooter
} from "@now/ui";
import { TrendingUp } from "lucide-react";
import React from "react";
import { CartesianGrid, Line, LineChart as LineChartComponent, XAxis } from "recharts";
import { ChartRowData, LineChart, LineChartConfig } from "@now/utils";
import { observer } from "mobx-react";

export const LineChartNow = observer(function LineChartNow({ chart }: { chart: LineChart }) {
    const chartData: ChartRowData[] = chart.ChartData;
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
        <Card className="flex flex-col size-full bg-transparent">
            <CardHeader>
                <CardTitle>Line Chart - Linear</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 overflow-hidden">
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
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
            </CardFooter>
        </Card>
    );
});
