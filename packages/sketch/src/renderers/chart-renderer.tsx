import { AppLoader } from "@now/ui";
import { Chart, useDataLoader, ChartNow, ChartFactory } from "@now/utils";
import {
    BarChartNow,
    PieChartNow,
    CutomTable,
    LineChartNow,
    AreaChartNow,
    RadarChartNow,
    RadialBarChartNow
} from "@now/visualize";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export const ChartsRenderer = observer(function ChartsRenderer({ component }: { component: ChartNow }) {
    const { chart } = component;
    const { loading } = useDataLoader(chart!, component.id);
    const [ready, setReady] = useState(false);
    const { ref, inView } = useInView({
        threshold: 0.2
        // triggerOnce: true
    });

    useEffect(() => {
        if (inView) {
            const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
            const id = schedule(() => setReady(true));
            return () => {
                if (window.cancelIdleCallback) window.cancelIdleCallback(id);
                else clearTimeout(id);
            };
        }
    }, [inView]);

    if (chart == null) {
        return null;
    }

    return (
        <>
            <AppLoader loading={loading} />
            <div className="size-full flex justify-center items-center" ref={ref}>
                {chart.IsConfigured ? (
                    <ChartRenderer chart={chart} />
                ) : (
                    <div className="size-full flex justify-center items-center">
                        {!ready ? "Loading..." : "Not Configured"}
                    </div>
                )}
            </div>
        </>
    );
});

const ChartRenderer = observer(function ChartRenderer({ chart }: { chart: Chart }) {
    const typedChart = ChartFactory.getChartConfig(chart);
    switch (typedChart.type) {
        case "Bar":
            return <BarChartNow chart={chart} />;
        case "Line":
            return <LineChartNow chart={chart} />;
        case "Area":
            return <AreaChartNow chart={chart} />;
        case "Pie":
            return <PieChartNow chart={chart} />;
        case "Radar":
            return <RadarChartNow chart={chart} />;
        case "RadialBar":
            return <RadialBarChartNow chart={chart} />;
        default:
            return <CutomTable chart={chart} />;
    }
});
