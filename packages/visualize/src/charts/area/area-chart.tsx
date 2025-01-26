"use client";

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
import { AreaChart, AreaChartConfig, ChartRowData } from "@now/utils";
import { TrendingUp } from "lucide-react";
import { observer } from "mobx-react";
import { Area, AreaChart as AreaChartComponent, CartesianGrid, XAxis } from "recharts";

export const AreaChartNow = observer(function AreaChartNow({ chart }: { chart: AreaChart }) {
    const chartData: ChartRowData[] = chart.ChartData;
    const config = chart.Config as AreaChartConfig;
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
                <CardTitle>Area Chart - Stacked</CardTitle>
                <CardDescription>Showing total visitors for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 overflow-hidden">
                <ChartContainer config={chartConfig} className="size-full">
                    <AreaChartComponent
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={xAxis.name}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        {yAxis.map((v) => (
                            <Area
                                key={v.name}
                                dataKey={v.name}
                                fillOpacity={0.4}
                                stroke={`var(--color-${v.name})`}
                                dot={false}
                                type="natural"
                            />
                        ))}
                    </AreaChartComponent>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            January - June 2024
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
});
