import { AppLoader, Button, Icon, Label, ScrollArea, ScrollBar } from "@now/ui";
import { SavedCanvas, useStore } from "@now/utils";
import { TrashIcon } from "lucide-react";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NoSketch } from "../helpers/no-sketch-page";
import { useQuery } from "@tanstack/react-query";

export const SketchList = observer(function SketchList() {
    const { sketchStore } = useStore();
    const [sketches, setSketches] = useState<SavedCanvas[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const sketches = await sketchStore.GetAllSketches();
        setSketches(sketches);
        setLoading(false);
    };

    const deleteSketch = async (canvasId: string) => {
        setSketches(sketches.filter((s) => s._id !== canvasId));
        await sketchStore.DeleteSketch(canvasId);
    };

    return (
        <div className="flex size-full items-center justify-center">
            {loading ? <AppLoader /> : null}
            {sketches.length === 0 && !loading ? (
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

    const { data, isLoading } = useQuery({
        queryFn: async () => {
            return await sketchStore.GetImageData(canvasId);
        },
        queryKey: ["SketchImageData", canvasId],
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false
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
                <div className=" box-content aspect-square h-[200px] w-[300px] cursor-pointer rounded-sm border-2 border-gray-500/30 object-cover">
                    {isLoading ? <AppLoader /> : null}
                </div>
            ) : (
                <>
                    <div className="absolute right-0 top-0 gap-2">
                        <Button
                            size="xs"
                            variant="ghost"
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
                        className=" box-content aspect-square h-[200px] w-[300px] cursor-pointer rounded-sm border-2 border-gray-500/30 object-cover"
                        src={data ?? ""}
                    />
                </>
            )}
            <Label className="p-1 text-lg">{name}</Label>
        </div>
    );
};
