"use client";

import * as React from "react";
import { RadialBar, RadialBarChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@now/ui";
import { ChartRowData, PieChart, RadialBarChartConfig } from "@now/utils";
import { observer } from "mobx-react";

export const RadialBarChartNow = observer(function RadialBarChartNow({ chart }: { chart: PieChart }) {
    const chartData: ChartRowData[] = chart.ChartData.data;
    const config = chart.Config as RadialBarChartConfig;
    const dimension = config.dimensions.v.v;

    const measure = config.measures.v.v;

    const items = React.useMemo(() => {
        if (dimension == null) {
            return [];
        }

        return chartData.reduce((r, curr) => {
            if (!r.includes(curr[dimension.name])) {
                r.push(curr[dimension.name]);
            }
            return r;
        }, [] as string[]);
    }, [chartData, dimension]);

    const reducedData = React.useMemo(() => {
        if (dimension == null) {
            return [];
        }
        return chartData.map((d) => ({
            ...d,
            fill: `#${Math.random().toString(16).substr(-6)}`,
            name: d[dimension.name]
        }));
    }, [chartData, dimension]);

    if (dimension == null || measure == null) {
        return null;
    }

    const chartConfig: ChartConfig = {};
    items.forEach((column) => {
        chartConfig[column] = {
            label: column,
            color: `#${Math.random().toString(16).substr(-6)}`
        };
    });

    return (
        <ChartContainer config={chartConfig} className="mx-auto size-full">
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={reducedData}>
                <RadialBar label={{ position: "insideEnd", fill: "#fff" }} background dataKey={measure.name} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent labelKey={dimension.name} />} />
            </RadialBarChart>
        </ChartContainer>
    );
});
