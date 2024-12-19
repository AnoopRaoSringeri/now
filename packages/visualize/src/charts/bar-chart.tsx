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
import React from "react";
import { Bar, BarChart as BarChartComponent, CartesianGrid, XAxis } from "recharts";

export const BarChart = React.memo(function BarChart({ chartData }: { chartData: ChartData }) {
    const chartConfig = {
        [chartData.columns[1]]: {
            label: chartData.columns[1],
            color: "#2563eb"
        },
        [chartData.columns[8]]: {
            label: chartData.columns[8],
            color: "#60a5fa"
        }
    } satisfies ChartConfig;
    return (
        <ChartContainer config={chartConfig} className="size-full">
            <BarChartComponent accessibilityLayer data={chartData.data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey={chartData.columns[7]} tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey={chartData.columns[1]} fill={`var(--color-${chartData.columns[1]})`} radius={4} />
                <Bar dataKey={chartData.columns[8]} fill={`var(--color-${chartData.columns[8]})`} radius={4} />
                <Bar dataKey={chartData.columns[2]} fill={`var(--color-${chartData.columns[8]})`} radius={4} />
            </BarChartComponent>
        </ChartContainer>
    );
});
