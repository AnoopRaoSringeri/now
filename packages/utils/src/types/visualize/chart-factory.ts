import { ChartMetadata, Chart } from "./chart";
import { BarChartConfig } from "./charts/bar-class";
import { ChartTypes } from "./chart-types";
import { LineChartConfig } from "./charts/line-class";
import { PieChartConfig } from "./charts/pie-class";
import { TableChartConfig } from "./charts/table-class";
import { ChartConfigMetadata, ChartType } from "./types";
import { AreaChartConfig } from "./charts/area-class";
import { RadarChartConfig } from "./charts/radar-class";
import { RadialBarChartConfig } from "./charts/radial-bar-class";

export class ChartFactory {
    static restoreChart(chart: ChartMetadata) {
        const chartObj = new Chart(chart.config, chart.type);
        chartObj.Source = chart.source;
        if (chartObj.type === "Table") {
            chartObj.Page = 1;
        }
        return chartObj;
    }

    static convertChartConfig(metadata: ChartConfigMetadata, type: ChartType) {
        let transformedMetadata: ChartConfigMetadata = metadata;
        switch (type) {
            case "Table": {
                transformedMetadata = {
                    dimensions: {
                        t: "m",
                        v: {
                            t: "mcs",
                            v:
                                metadata.dimensions.v.t === "scs"
                                    ? metadata.dimensions.v.v
                                        ? [metadata.dimensions.v.v]
                                        : []
                                    : metadata.dimensions.v.v
                        }
                    },
                    measures: {
                        t: "m",
                        v: {
                            t: "mms",
                            v:
                                metadata.measures.v.t === "sms"
                                    ? metadata.measures.v.v
                                        ? [metadata.measures.v.v]
                                        : []
                                    : metadata.measures.v.v
                        }
                    }
                };
                break;
            }
            case "RadialBar":
            case "Pie": {
                transformedMetadata = {
                    dimensions: {
                        t: "s",
                        v: {
                            t: "scs",
                            v: metadata.dimensions.v.t === "scs" ? metadata.dimensions.v.v : metadata.dimensions.v.v[0]
                        }
                    },
                    measures: {
                        t: "s",
                        v: {
                            t: "sms",
                            v: metadata.measures.v.t === "sms" ? metadata.measures.v.v : metadata.measures.v.v[0]
                        }
                    }
                };
                break;
            }
            default: {
                transformedMetadata = {
                    dimensions: {
                        t: "s",
                        v: {
                            t: "scs",
                            v: metadata.dimensions.v.t === "scs" ? metadata.dimensions.v.v : metadata.dimensions.v.v[0]
                        }
                    },
                    measures: {
                        t: "m",
                        v: {
                            t: "mms",
                            v:
                                metadata.measures.v.t === "sms"
                                    ? metadata.measures.v.v
                                        ? [metadata.measures.v.v]
                                        : []
                                    : metadata.measures.v.v
                        }
                    }
                };
                break;
            }
        }
        return transformedMetadata;
    }

    static getChartConfig(chart: Chart): ChartTypes {
        switch (chart.type) {
            case "Bar":
                return { type: "Bar", config: chart.Config as BarChartConfig };
            case "Line":
                return { type: "Line", config: chart.Config as LineChartConfig };
            case "Area":
                return { type: "Area", config: chart.Config as AreaChartConfig };
            case "Pie":
                return { type: "Pie", config: chart.Config as PieChartConfig };
            case "Radar":
                return { type: "Radar", config: chart.Config as RadarChartConfig };
            case "RadialBar":
                return { type: "RadialBar", config: chart.Config as RadialBarChartConfig };
            default:
                return { type: "Table", config: chart.Config as TableChartConfig };
        }
    }
}
