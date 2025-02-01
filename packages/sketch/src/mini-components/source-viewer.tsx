import { forwardRef, useImperativeHandle, useState } from "react";
import { TableNow, Drawer, DrawerContent, AppLoader, DrawerHeader, DrawerDescription, DrawerTitle } from "@now/ui";
import { ChartSource, QueryKeys, useQueryNow, useStore } from "@now/utils";

export interface SourceViewerHandle {
    show: (source: ChartSource) => unknown;
}

export const SourceViewer = forwardRef<SourceViewerHandle>(function SourceViewer(_, ref) {
    const [source, setSource] = useState<ChartSource | null>(null);
    const { sketchStore } = useStore();

    const { data, isLoading } = useQueryNow({
        queryKey: [QueryKeys.SourceData, source?.id ?? 0],
        queryFn: async () => {
            if (source) {
                return await sketchStore.GetSourceData(source.id);
            } else {
                return [];
            }
        },
        enabled: source != null
    });

    useImperativeHandle(ref, () => ({
        show: (source) => {
            setSource(source);
        }
    }));

    if (!source) {
        return null;
    }

    return (
        <Drawer
            open={source != null}
            onOpenChange={(value) => {
                if (!value) {
                    setSource(null);
                }
            }}
        >
            <DrawerContent className="h-[60vh] p-2 flex">
                <DrawerHeader>
                    <DrawerTitle>{source.name}</DrawerTitle>
                    <DrawerDescription>{""}</DrawerDescription>
                </DrawerHeader>
                <AppLoader loading={isLoading} />
                <TableNow rows={data ?? []} columns={source.columns.map((c) => c.name)} />
            </DrawerContent>
        </Drawer>
    );
});
