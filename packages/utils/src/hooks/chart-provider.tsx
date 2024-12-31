import { createContext, ReactNode, useContext } from "react";
import { Chart } from "../types/visualize/chart";

const StoreContex = createContext({});

const useChart = () => {
    return useContext(StoreContex);
};

const ChartProvider = ({ children, chartContext }: { children: ReactNode; chartContext: Chart }) => {
    return <StoreContex.Provider value={chartContext}>{children}</StoreContex.Provider>;
};
export { ChartProvider, useChart };
