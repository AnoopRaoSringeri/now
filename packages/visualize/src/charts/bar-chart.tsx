"use client";

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@now/ui";
import { BarChart, BarChartConfig, ChartRowData } from "@now/utils";
import { observer } from "mobx-react";
import React from "react";
import { Bar, BarChart as BarChartComponent, CartesianGrid, XAxis } from "recharts";

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
        <ChartContainer config={chartConfig} className="size-full">
            <BarChartComponent accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey={xAxis.name} tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {config.measures.v.v.map((v) => (
                    <Bar key={v.name} dataKey={v.name} fill={`var(--color-${v.name})`} radius={4} />
                ))}
            </BarChartComponent>
        </ChartContainer>
    );
});
