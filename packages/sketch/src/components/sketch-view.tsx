import { AppLoader, Button, Icon, Label, ScrollArea, ScrollBar } from "@now/ui";
import { QueryKeys, useQueryNow, useStore } from "@now/utils";
import { observer } from "mobx-react";
import { useNavigate } from "react-router";
import { NoSketch } from "../helpers/no-sketch-page";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const SketchList = observer(function SketchList() {
    const queryClient = useQueryClient();
    const { sketchStore } = useStore();

    const { data: sketches, isLoading: loading } = useQueryNow({
        queryFn: async () => {
            return await sketchStore.GetAllSketches();
        },
        queryKey: [QueryKeys.SketchList]
    });

    const { mutate } = useMutation({
        mutationFn: async (id: string) => {
            await sketchStore.DeleteSketch(id);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.SketchList] })
    });

    const deleteSketch = (id: string) => {
        mutate(id);
    };

    return (
        <div className="flex size-full items-center justify-center">
            {loading ? <AppLoader /> : null}
            {sketches == null || (sketches.length === 0 && !loading) ? (
                <NoSketch />
            ) : (
                <ScrollArea className="size-full p-5" type="auto">
                    <div className="flex flex-1 flex-wrap gap-5 overflow-hidden">
                        {sketches.map((d) => (
                            <Sketch key={d._id} canvasId={d._id} name={d.name} onDelete={deleteSketch} />
                        ))}
                    </div>
                    <ScrollBar />
                </ScrollArea>
            )}
        </div>
    );
});

const Sketch = function Sketch({
    canvasId,
    name,
    onDelete
}: {
    canvasId: string;
    name: string;
    onDelete: (id: string) => unknown;
}) {
    const { sketchStore } = useStore();
    const navigate = useNavigate();

    const { data, isLoading } = useQueryNow({
        queryFn: async () => {
            return await sketchStore.GetImageData(canvasId);
        },
        queryKey: [QueryKeys.SketchImageData, canvasId]
    });

    const gotoView = () => {
        navigate(`/sketch-now/sketch-viewer/${canvasId}`);
    };

    const onClick = () => {
        navigate(`/sketch-now/sketch/${canvasId}`);
    };

    return (
        <div className="group relative flex flex-col items-center gap-0 rounded-sm">
            {isLoading ? (
                <div className=" box-content aspect-square h-50 w-75 cursor-pointer rounded-sm border-2 border-gray-500/30 object-cover">
                    {isLoading ? <AppLoader /> : null}
                </div>
            ) : (
                <>
                    <div className="absolute right-0 top-0 gap-2">
                        <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => gotoView()}
                            className="opacity-0  transition duration-300 group-hover:opacity-100"
                        >
                            <Icon name="Eye" size={20} color="white" />
                        </Button>
                        <Button
                            size="xs"
                            variant="destructive"
                            onClick={() => onDelete(canvasId)}
                            className="opacity-0  transition duration-300 group-hover:opacity-100"
                        >
                            <Icon name="Trash" size={20} color="white" />
                        </Button>
                    </div>
                    <img
                        onClick={onClick}
                        className=" box-content aspect-square h-50 w-75 cursor-pointer rounded-sm border-2 border-gray-500/30 object-contain"
                        src={data ?? ""}
                        alt=""
                    />
                </>
            )}
            <Label className="p-1 text-lg">{name}</Label>
        </div>
    );
};
