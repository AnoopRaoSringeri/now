"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@now/ui";
import { AreaChart, AreaChartConfig, ChartRowData } from "@now/utils";
import { observer } from "mobx-react";
import { Area, AreaChart as AreaChartComponent, CartesianGrid, XAxis } from "recharts";

export const AreaChartNow = observer(function AreaChartNow({ chart }: { chart: AreaChart }) {
    const chartData: ChartRowData[] = chart.ChartData.data;
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
    );
});
