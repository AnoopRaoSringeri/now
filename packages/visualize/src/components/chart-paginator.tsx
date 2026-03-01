import { useResizeObserver } from "@mantine/hooks";
import { ReactNode, useCallback, useState } from "react";
import { Brush } from "recharts";

export const ROWS_PER_PAGE = 20;

export function ChartPaginator({
    children,
    rowCount
}: {
    children: (component: ReactNode) => ReactNode;
    rowCount: number;
}) {
    const [scrollRef, { width }] = useResizeObserver();
    const [currentPage, setCurrentPage] = useState(0);

    const onScrollEvent = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        const ratio = el.scrollLeft / maxScroll;

        const newStart = Math.round(ratio * (rowCount - ROWS_PER_PAGE));
        if (newStart > 0) {
            setCurrentPage(newStart);
        }
    }, [rowCount]);

    const totalPages = Math.ceil(rowCount / ROWS_PER_PAGE);

    const visible = totalPages > 1;

    return (
        <div className="size-full flex flex-col">
            {children(<Paginator currentPage={currentPage} visible={visible} />)}

            <div
                ref={scrollRef}
                style={{
                    overflowX: "auto"
                }}
                onScroll={onScrollEvent}
            >
                {visible && <div style={{ width: `${totalPages * width}px`, height: 20 }} />}
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
