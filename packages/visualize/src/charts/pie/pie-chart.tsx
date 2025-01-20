"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart as PieChartComponent } from "recharts";
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
import { ChartData, formatText, PieChartConfig } from "@now/utils";

export const PieChartNow = React.memo(function PieChartNow({
    chartConfig: config,
    chartData
}: {
    chartData: ChartData;
    chartConfig: PieChartConfig;
}) {
    const measure = config.measures.v.v;

    const dimension = config.dimensions.v.v;

    const total = React.useMemo(() => {
        if (measure == null) {
            return 0;
        }

        return chartData.data.reduce((acc, curr) => acc + Number(curr[measure.name]), 0);
    }, [chartData.data, measure]);

    const items = React.useMemo(() => {
        if (dimension == null) {
            return [];
        }

        return chartData.data.reduce((r, curr) => {
            if (!r.includes(curr[dimension.name])) {
                r.push(curr[dimension.name]);
            }
            return r;
        }, [] as string[]);
    }, [chartData.data, dimension]);

    const reducedData = React.useMemo(() => {
        if (dimension == null) {
            return [];
        }
        return chartData.data.map((d) => ({ ...d, fill: `var(--color-${d[dimension.name]})` }));
    }, [chartData.data, dimension]);

    const chartConfig: ChartConfig = {};
    items.forEach((item) => {
        chartConfig[item] = {
            label: item,
            color: `#${Math.random().toString(16).substr(-6)}`
        };
    });

    if (measure == null || dimension == null) {
        return null;
    }

    return (
        <Card className="flex flex-col size-full bg-transparent">
            <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Donut with Text</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 overflow-hidden">
                <ChartContainer config={chartConfig} className="mx-auto size-full">
                    <PieChartComponent>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={reducedData}
                            dataKey={measure.name}
                            nameKey={dimension.name}
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
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
                        </Pie>
                    </PieChartComponent>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
            </CardFooter>
        </Card>
    );
});
