import { ChartType, ColumnConfig, Chart, ChartMetadata } from "@now/utils";
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
                    dimensions: {
                        t: "s",
                        v: {
                            t: "scs",
                            v: null
                        }
                    },
                    measures: {
                        t: "m",
                        v: {
                            t: "mcs",
                            v: []
                        }
                    }
                });
            case "Line":
                return new LineChart({
                    dimensions: {
                        t: "s",
                        v: {
                            t: "scs",
                            v: null
                        }
                    },
                    measures: {
                        t: "m",
                        v: {
                            t: "mcs",
                            v: []
                        }
                    }
                });
            case "Pie":
                return new PieChart({
                    dimensions: {
                        t: "s",
                        v: {
                            t: "scs",
                            v: null
                        }
                    },
                    measures: {
                        t: "s",
                        v: {
                            t: "scs",
                            v: null
                        }
                    }
                });
            default:
                return new TableChart({
                    dimensions: {
                        t: "m",
                        v: {
                            t: "mcs",
                            v: []
                        }
                    },
                    measures: {
                        t: "m",
                        v: {
                            t: "mcs",
                            v: []
                        }
                    }
                });
        }
    }

    static restoreChart(chart: ChartMetadata) {
        const chartObj = new Chart(chart.config, chart.type);
        // chartObj.columnConfig = chart.columnConfig;
        return chartObj;
    }

    static getChartConfig(chart: Chart): ChartTypes {
        switch (chart.type) {
            case "Bar":
                return { type: "Bar", config: chart.Config as BarChartConfig };
            case "Line":
                return { type: "Line", config: chart.Config as LineChartConfig };
            case "Pie":
                return { type: "Pie", config: chart.Config as PieChartConfig };
            // case "Area":
            //     return chart.config as LineChartConfig;
            default:
                return { type: "Table", config: chart.Config as TableChartConfig };
        }
    }
}
