import { TableChartConfig } from "../table/class";
import { BarChartConfig } from "./bar/class";
import { LineChartConfig } from "./line/class";
import { PieChartConfig } from "./pie/class";

export type ChartTypes =
    | {
          type: "Bar";
          config: BarChartConfig;
      }
    | {
          type: "Line";
          config: LineChartConfig;
      }
    | {
          type: "Pie";
          config: PieChartConfig;
      }
    | {
          type: "Table";
          config: TableChartConfig;
      };
