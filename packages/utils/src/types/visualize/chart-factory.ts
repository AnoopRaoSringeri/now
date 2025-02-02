import { ChartMetadata, Chart } from "./chart";
import { BarChart, BarChartConfig } from "./charts/bar-class";
import { ChartTypes } from "./chart-types";
import { LineChart, LineChartConfig } from "./charts/line-class";
import { PieChart, PieChartConfig } from "./charts/pie-class";
import { TableChart, TableChartConfig } from "./charts/table-class";
import { ChartConfigMetadata, ChartType, ColumnConfig } from "./types";
import { AreaChart, AreaChartConfig } from "./charts/area-class";
import { RadarChartConfig } from "./charts/radar-class";

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
            case "Area":
                return new AreaChart({
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
        chartObj.Source = chart.source;
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
                            t: "mcs",
                            v:
                                metadata.measures.v.t === "scs"
                                    ? metadata.measures.v.v
                                        ? [metadata.measures.v.v]
                                        : []
                                    : metadata.measures.v.v
                        }
                    }
                };
                break;
            }
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
                            t: "scs",
                            v: metadata.measures.v.t === "scs" ? metadata.measures.v.v : metadata.measures.v.v[0]
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
                            t: "mcs",
                            v:
                                metadata.measures.v.t === "scs"
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
            default:
                return { type: "Table", config: chart.Config as TableChartConfig };
        }
    }
}
