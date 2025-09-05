import { ReactNode, useEffect, useRef, useState } from "react";
import { Brush } from "recharts";

export const ROWS_PER_PAGE = 20;

export function ChartPaginator({
    children,
    rowCount
}: {
    children: (component: ReactNode) => ReactNode;
    rowCount: number;
}) {
    const [currentPage, setCurrentPage] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onScrollEvent = () => {
            const maxScroll = el.scrollWidth - el.clientWidth;
            const ratio = el.scrollLeft / maxScroll;

            const newStart = Math.round(ratio * (rowCount - ROWS_PER_PAGE));
            if (newStart > 0) {
                setCurrentPage(newStart);
            }
        };

        el.addEventListener("scroll", onScrollEvent);
        return () => el.removeEventListener("scroll", onScrollEvent);
    }, [rowCount]);

    const visible = Math.ceil(rowCount / ROWS_PER_PAGE) > 1;

    return (
        <div className="size-full flex flex-col">
            {children(<Paginator currentPage={currentPage} visible={visible} />)}

            <div
                ref={scrollRef}
                style={{
                    overflowX: "auto"
                }}
            >
                {visible && <div style={{ width: `${rowCount * 10}px`, height: 20 }} />}
            </div>
        </div>
    );
}

export const Paginator = ({ currentPage, visible }: { currentPage: number; visible: boolean }) => {
    const endIndex = currentPage + ROWS_PER_PAGE - 1;

    return (
        visible && (
            <Brush
                dataKey="rowid"
                height={5}
                x={0}
                startIndex={currentPage}
                endIndex={endIndex}
                gap={ROWS_PER_PAGE}
                className="hidden"
            />
        )
    );
};
