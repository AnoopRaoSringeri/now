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
      ) & { name: string; id: string | null };
