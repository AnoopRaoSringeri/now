// import { AppLoader } from "@now/ui";
// import { Chart, ChartFactory, ChartNow, useDataLoader } from "@now/utils";
// import {
//     AreaChartNow,
//     BarChartNow,
//     CutomTable,
//     LineChartNow,
//     PieChartNow,
//     RadarChartNow,
//     RadialBarChartNow
// } from "@now/visualize";
// import { observer } from "mobx-react";
// import { useEffect, useState } from "react";
// import { useInView } from "react-intersection-observer";

// export const ChartsRenderer = observer(function ChartsRenderer({ component }: { component: ChartNow }) {
//     const { chart } = component;
//     const { loading } = useDataLoader(chart!, component.id);
//     const [ready, setReady] = useState(false);
//     const { ref, inView } = useInView({
//         threshold: 0.2
//         // triggerOnce: true
//     });

//     useEffect(() => {
//         if (inView) {
//             const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
//             const id = schedule(() => setReady(true));
//             return () => {
//                 if (window.cancelIdleCallback) window.cancelIdleCallback(id);
//                 else clearTimeout(id);
//             };
//         }
//     }, [inView]);

//     if (chart == null) {
//         return null;
//     }

//     return (
//         <>
//             <AppLoader loading={loading} />
//             <div className="size-full flex justify-center items-center" ref={ref}>
//                 {chart.IsConfigured ? (
//                     <ChartRenderer chart={chart} />
//                 ) : (
//                     <div className="size-full flex justify-center items-center">
//                         {!ready ? "Loading..." : "Not Configured"}
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// });

// const ChartRenderer = observer(function ChartRenderer({ chart }: { chart: Chart }) {
//     const typedChart = ChartFactory.getChartConfig(chart);
//     switch (typedChart.type) {
//         case "Bar":
//             return <BarChartNow chart={chart} />;
//         case "Line":
//             return <LineChartNow chart={chart} />;
//         case "Area":
//             return <AreaChartNow chart={chart} />;
//         case "Pie":
//             return <PieChartNow chart={chart} />;
//         case "Radar":
//             return <RadarChartNow chart={chart} />;
//         case "RadialBar":
//             return <RadialBarChartNow chart={chart} />;
//         default:
//             return <CutomTable chart={chart} />;
//     }
// });
import { AppLoader } from "@now/ui";
import { Chart, ChartFactory, ChartNow, useDataLoader } from "@now/utils";
import {
    AreaChartNow,
    BarChartNow,
    CutomTable,
    LineChartNow,
    PieChartNow,
    RadarChartNow,
    RadialBarChartNow
} from "@now/visualize";
import { observer } from "mobx-react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

export const ChartsRenderer = observer(function ChartsRenderer({ component }: { component: ChartNow }) {
    const { chart } = component;
    const { loading } = useDataLoader(chart!, component.id);

    const containerRef = useRef<HTMLDivElement>(null);
    const { ref: inViewRef, inView } = useInView({
        threshold: 0.2,
        triggerOnce: false
    });

    const [hasSize, setHasSize] = useState(false);

    // Merge refs (important)
    const setRefs = (node: HTMLDivElement | null) => {
        containerRef.current = node;
        inViewRef(node);
    };

    // Guard against width/height 0 (Recharts fix)
    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) {
                setHasSize(true);
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    if (!chart) return null;

    const shouldRenderChart = chart.IsConfigured && inView && hasSize && !loading;

    return (
        <>
            <AppLoader loading={loading} />

            <div ref={setRefs} className="w-full h-full flex justify-center items-center">
                {shouldRenderChart ? (
                    <ChartRenderer chart={chart} />
                ) : (
                    <div className="w-full h-full flex justify-center items-center">
                        {!chart.IsConfigured ? "Not Configured" : "Loading..."}
                    </div>
                )}
            </div>
        </>
    );
});

const ChartRenderer = observer(function ChartRenderer({ chart }: { chart: Chart }) {
    const typedChart = useMemo(() => ChartFactory.getChartConfig(chart), [chart]);

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
