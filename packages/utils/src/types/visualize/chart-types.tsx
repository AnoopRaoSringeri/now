import { AreaChartConfig } from "./charts/area-class";
import { BarChartConfig } from "./charts/bar-class";
import { LineChartConfig } from "./charts/line-class";
import { PieChartConfig } from "./charts/pie-class";
import { TableChartConfig } from "./charts/table-class";

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
          type: "Area";
          config: AreaChartConfig;
      }
    | {
          type: "Pie";
          config: PieChartConfig;
      }
    | {
          type: "Table";
          config: TableChartConfig;
      };
