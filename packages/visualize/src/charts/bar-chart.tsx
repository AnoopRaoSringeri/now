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
import { useEffect, useRef, useState } from "react";
import { Bar, BarChart as BarChartComponent, Brush, CartesianGrid, XAxis } from "recharts";

const ROWS_PER_PAGE = 20;

export const BarChartNow = observer(function BarChartNow({ chart }: { chart: BarChart }) {
    const chartData: ChartRowData[] = chart.ChartData.data;
    const config = chart.Config as BarChartConfig;
    const xAxis = config.dimensions.v.v;
    const scrollRef = useRef<HTMLDivElement>(null);
    const [startIndex, setStartIndex] = useState(0);
    const endIndex = startIndex + ROWS_PER_PAGE - 1;
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onScroll = () => {
            const maxScroll = el.scrollWidth - el.clientWidth;
            const ratio = el.scrollLeft / maxScroll;

            const newStart = Math.round(ratio * (chartData.length - ROWS_PER_PAGE));
            if (newStart > 0) {
                setStartIndex(newStart);
            }
        };

        el.addEventListener("scroll", onScroll);
        return () => el.removeEventListener("scroll", onScroll);
    }, [chartData.length]);

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
    const pages = Math.ceil(chartData.length / ROWS_PER_PAGE);

    return (
        <div className="size-full flex-col">
            <ChartContainer config={chartConfig} className="size-full">
                <BarChartComponent accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={xAxis.name} tickLine={false} tickMargin={10} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    {config.measures.v.v.map((v) => (
                        <Bar key={v.name} dataKey={v.name} fill={`var(--color-${v.name})`} radius={4} />
                    ))}
                    {pages > 1 && (
                        <Brush
                            dataKey="rowid"
                            height={5}
                            x={0}
                            startIndex={startIndex}
                            endIndex={endIndex}
                            gap={ROWS_PER_PAGE}
                            onChange={({ startIndex: s }) => {
                                if (s !== undefined && s > 0) setStartIndex(s);
                            }}
                            className="hidden"
                        />
                    )}
                </BarChartComponent>
            </ChartContainer>

            <div
                ref={scrollRef}
                style={{
                    overflowX: "auto"
                }}
            >
                {pages > 1 && <div style={{ width: `${chartData.length * 10}px`, height: 20 }} />}
            </div>
        </div>
    );
});
