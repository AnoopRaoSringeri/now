import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@now/ui";
import { ChartRowData, RadarChart, RadarChartConfig } from "@now/utils";
import { observer } from "mobx-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RadarChartComponent } from "recharts";

export const RadarChartNow = observer(function RadarChartNow({ chart }: { chart: RadarChart }) {
    const chartData: ChartRowData[] = chart.ChartData.data;
    const config = chart.Config as RadarChartConfig;
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
        <ChartContainer config={chartConfig} className="mx-auto size-full">
            <RadarChartComponent data={chartData}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <PolarAngleAxis dataKey={xAxis.name} />
                <PolarGrid />
                {config.measures.v.v.map((m) => (
                    <Radar key={m.name} dataKey={m.name} fill={`var(--color-${m.name})`} fillOpacity={0.6} />
                ))}
            </RadarChartComponent>
        </ChartContainer>
    );
});
