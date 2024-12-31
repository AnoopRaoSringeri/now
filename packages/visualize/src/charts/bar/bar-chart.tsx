"use client";

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@now/ui";
import { ChartData } from "@now/utils";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { Bar, BarChart as BarChartComponent, CartesianGrid, XAxis } from "recharts";
import { BarChartConfig } from "./class";

export const BarChartNow = observer(function BarChartNow({
    chartData,
    chartConfig: config
}: {
    chartData: ChartData;
    chartConfig: BarChartConfig;
}) {
    const memoizedData = chartData.data;

    const xAxis = config.xAxis.getValue();

    if (xAxis == null || config.yAxis.getValue().length === 0) {
        return null;
    }

    const usedColumn = [xAxis, ...config.yAxis.getValue()];

    const chartConfig: ChartConfig = {};
    usedColumn.forEach((column) => {
        chartConfig[column.name] = {
            label: column.name,
            color: "#2563eb"
        };
    });

    return (
        <ChartContainer config={chartConfig} className="size-full">
            <BarChartComponent accessibilityLayer data={memoizedData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey={xAxis.name} tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {config.yAxis.getValue().map((v) => (
                    <Bar key={v.name} dataKey={v.name} fill={`var(--color-${v.name})`} radius={4} />
                ))}
            </BarChartComponent>
        </ChartContainer>
    );
});
