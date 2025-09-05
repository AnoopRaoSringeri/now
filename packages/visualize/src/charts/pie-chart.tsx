"use client";

import * as React from "react";
import { Cell, Label, Pie, PieChart as PieChartComponent } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@now/ui";
import { ChartRowData, formatText, PieChart, PieChartConfig } from "@now/utils";
import { observer } from "mobx-react";

export const PieChartNow = observer(function PieChartNow({ chart }: { chart: PieChart }) {
    const chartData: ChartRowData[] = chart.ChartData.data;
    const config = chart.Config as PieChartConfig;
    const measure = config.measures.v.v;

    const dimension = config.dimensions.v.v;

    const total = React.useMemo(() => {
        if (measure == null) {
            return 0;
        }

        return chartData.reduce((acc, curr) => acc + Number(curr[measure.name]), 0);
    }, [chartData, measure]);

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

    if (measure == null || dimension == null) {
        return null;
    }
    const chartConfig: ChartConfig = {};
    items.forEach((item) => {
        chartConfig[item] = {
            label: item,
            color: `#${Math.random().toString(16).substr(-6)}`
        };
    });

    chartConfig[measure.name] = {
        label: measure.name,
        color: `#${Math.random().toString(16).substr(-6)}`
    };

    return (
        <ChartContainer config={chartConfig} className="mx-auto size-full">
            <PieChartComponent data={reducedData}>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent labelKey={dimension.name} nameKey={measure.name} />}
                />
                <Pie dataKey={measure.name} nameKey={dimension.name}>
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold"
                                        >
                                            {total.toLocaleString()}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            {formatText(measure.name)}
                                        </tspan>
                                    </text>
                                );
                            }
                        }}
                    />
                    {items.map((item) => (
                        <Cell key={`cell-${item}`} fill={chartConfig[item].color} />
                    ))}
                </Pie>
            </PieChartComponent>
        </ChartContainer>
    );
});
