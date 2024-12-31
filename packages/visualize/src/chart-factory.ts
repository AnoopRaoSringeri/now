import { ChartType, ColumnConfig, MultiColumnSelectType, ColumnSelectType, Chart } from "@now/utils";
import { BarChart, BarChartConfig } from "./charts/bar/class";
import { LineChart, LineChartConfig } from "./charts/line/class";
import { PieChart, PieChartConfig } from "./charts/pie/class";
import { TableChart, TableChartConfig } from "./table/class";
import { ChartTypes } from "./charts/chart-types";

export class ChartFactory {
    static createChart(type: ChartType, columnConfig: ColumnConfig[]) {
        switch (type) {
            case "Bar":
                return new BarChart({
                    xAxis: new ColumnSelectType(columnConfig, {
                        t: "scs",
                        v: null
                    }),
                    yAxis: new MultiColumnSelectType(columnConfig, {
                        t: "mcs",
                        v: []
                    })
                });
            case "Line":
                return new LineChart({
                    xAxis: new ColumnSelectType(columnConfig, {
                        t: "scs",
                        v: null
                    }),
                    yAxis: new MultiColumnSelectType(columnConfig, {
                        t: "mcs",
                        v: []
                    })
                });
            case "Pie":
                return new PieChart({
                    measure: new ColumnSelectType(columnConfig, {
                        t: "scs",
                        v: null
                    }),
                    dimension: new ColumnSelectType(columnConfig, {
                        t: "scs",
                        v: null
                    })
                });
            default:
                return new TableChart({
                    columns: new MultiColumnSelectType(columnConfig, {
                        t: "mcs",
                        v: columnConfig
                    })
                });
        }
    }

    static restoreChart(chart: Chart) {
        const chartObj = new Chart(chart.config, chart.type);
        chartObj.columnConfig = chart.columnConfig;
        return chartObj;
    }

    static getChartConfig(chart: Chart): ChartTypes {
        switch (chart.type) {
            case "Bar":
                return { type: "Bar", config: chart.config as BarChartConfig };
            case "Line":
                return { type: "Line", config: chart.config as LineChartConfig };
            case "Pie":
                return { type: "Pie", config: chart.config as PieChartConfig };
            // case "Area":
            //     return chart.config as LineChartConfig;
            default:
                return { type: "Table", config: chart.config as TableChartConfig };
        }
    }
}
