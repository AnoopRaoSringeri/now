export type ChartSource =
    | {
          type: "File";
          value: string;
      }
    | {
          type: "Query";
          connectionString: string;
          query: string;
      };
