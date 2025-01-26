import { ColumnConfig } from "./types";

export type ChartSource =
    | (
          | {
                type: "File";
            }
          | {
                type: "Query";
                connectionString: string;
                query: string;
            }
      ) & { name: string; id: string; columns: ColumnConfig[] };
