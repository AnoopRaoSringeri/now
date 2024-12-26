import { ChartType, ColumnConfig, MultiColumnSelectType, ColumnSelectType } from "@now/utils";
import { BarChart } from "./charts/bar/class";
import { LineChart } from "./charts/line/class";
import { PieChart } from "./charts/pie/class";
import { TableChart } from "./table/class";

export class ChartFactory {
    static createChart(type: ChartType, columnConfig: ColumnConfig[]) {
        switch (type) {
            case "Bar":
                return new BarChart({
                    xAxis: new MultiColumnSelectType(columnConfig, {
                        t: "mcs",
                        v: []
                    }),
                    yAxis: new MultiColumnSelectType(columnConfig, {
                        t: "mcs",
                        v: []
                    })
                });
            case "Line":
                return new LineChart({
                    xAxis: new MultiColumnSelectType(columnConfig, {
                        t: "mcs",
                        v: []
                    }),
                    yAxis: new MultiColumnSelectType(columnConfig, {
                        t: "mcs",
                        v: []
                    })
                });
            case "Pie":
                return new PieChart({
                    xAxis: new ColumnSelectType(columnConfig, {
                        t: "scs",
                        v: null
                    }),
                    yAxis: new ColumnSelectType(columnConfig, {
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
}
