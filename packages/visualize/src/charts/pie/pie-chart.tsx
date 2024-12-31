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
import { PieChartConfig } from "./class";
import { ChartData } from "@now/utils";

export const PieChartNow = React.memo(function PieChartNow({
    chartConfig: config,
    chartData
}: {
    chartData: ChartData;
    chartConfig: PieChartConfig;
}) {
    const xAxis = config.measure.getValue();

    const yAxis = config.dimension.getValue();

    const total = React.useMemo(() => {
        if (yAxis == null) {
            return 0;
        }

        return chartData.data.reduce((acc, curr) => acc + Number(curr[yAxis.name]), 0);
    }, [chartData.data, yAxis]);

    const items = React.useMemo(() => {
        if (xAxis == null) {
            return [];
        }

        return chartData.data.reduce((r, curr) => {
            if (!r.includes(curr[xAxis.name])) {
                r.push(curr[xAxis.name]);
            }
            return r;
        }, [] as string[]);
    }, [chartData.data, xAxis]);

    const chartConfig: ChartConfig = {};
    items.forEach((item) => {
        chartConfig[item] = {
            label: item,
            color: "#2563eb"
        };
    });

    return (
        <Card className="flex flex-col size-full ">
            <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Donut with Text</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 overflow-hidden">
                <ChartContainer config={chartConfig} className="mx-auto size-full">
                    <PieChartComponent>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={chartData.data}
                            dataKey="visitors"
                            nameKey="browser"
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
                                                    Visitors
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
