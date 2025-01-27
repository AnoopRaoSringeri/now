import { observer } from "mobx-react";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ElementSelector from "./element-selector";
import { Badge, Button, Collapsible, CollapsibleContent, CollapsibleTrigger, Icon, Input, Label } from "@now/ui";
import { Expand, House, Save } from "lucide-react";
import { useCanvas } from "../hooks/use-canvas";
import { CustomizationPanelWrapper } from "../mini-components/canvas-style-editor";
import { ZoomController } from "../mini-components/zoom-controller";
import { QueryKeys, useStore } from "@now/utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DataUploader, DataUploaderHandle } from "../mini-components/data-uploader";

const CanvasOptions = observer(function CanvasOptions() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { canvasBoard } = useCanvas(id ?? "new");
    const queryClient = useQueryClient();
    const { sketchStore } = useStore();

    const saveBoard = async () => {
        const sketchName = canvasBoard.UiStateManager.BoardName;
        console.log(canvasBoard.Canvas.toDataURL());
        if (id && id !== "new") {
            await sketchStore.UpdateSketch(id, canvasBoard.toJSON(), sketchName, canvasBoard.Canvas.toDataURL());
            toast.success("Sketch saved successfully");
        } else {
            const response = await sketchStore.SaveSketch(
                canvasBoard.toJSON(),
                sketchName,
                canvasBoard.Canvas.toDataURL()
            );
            if (response) {
                toast.success("Sketch updated successfully");
                navigate(`/sketch-now/sketch/${response._id}`);
            }
        }
    };

    const { mutate, isPending } = useMutation({
        mutationFn: () => saveBoard(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.SketchList]
            });
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.Sketch, id]
            });
        }
    });

    const goToHome = () => {
        navigate("/sketch-now");
    };

    const onExpand = () => {
        canvasBoard.UiStateManager.toggleFullScreen();
    };

    return (
        <div className="absolute flex size-full overflow-hidden bg-transparent">
            <div className=" flex size-full items-center justify-center bg-transparent">
                <ElementSelector
                    onChange={(eleType) => {
                        canvasBoard.ElementType = eleType;
                    }}
                />
                <div className="absolute right-5 top-5 z-[10]">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="Name"
                            value={canvasBoard.UiStateManager.BoardName}
                            onChange={(e) => {
                                canvasBoard.UiStateManager.BoardName = e.target.value;
                            }}
                        />
                        <Button size="sm" onClick={() => mutate()} loading={isPending}>
                            <Save />
                        </Button>
                    </div>
                </div>
                <SourceSelector />
                <div className="absolute left-5 top-5 z-[10] gap-1 flex ">
                    <Button size="sm" onClick={goToHome}>
                        <House size="20px" />
                    </Button>
                    <Button size="sm" onClick={onExpand}>
                        <Expand size="20px" />
                    </Button>
                </div>
                <CustomizationPanelWrapper />
                <ZoomController />
            </div>
        </div>
    );
});

const SourceSelector = observer(function SourceSelector() {
    const [opened, setOpened] = useState(false);
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");
    const dataUploaderRef = useRef<DataUploaderHandle>(null);

    return (
        <div className="absolute right-5 top-20 max-h-[400px] z-[10]">
            <DataUploader ref={dataUploaderRef} sourceManager={canvasBoard.SourceManager} />
            <Collapsible open={opened} onOpenChange={setOpened} className="flex flex-row align-top">
                <div>
                    <CollapsibleTrigger className="h-7">
                        {opened ? <Icon name="ChevronsRight" /> : <Icon name="ChevronsLeft" />}
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="CollapsibleContent">
                    <div className="w-[200px] flex flex-col space-y-2">
                        {canvasBoard.SourceManager.Sources.map((source) => (
                            <Badge
                                key={source.id}
                                variant={
                                    canvasBoard.SourceManager.SelectedSource?.id !== source.id ? "outline" : "secondary"
                                }
                                className="h-7 cursor-pointer flex justify-between items-center gap-2"
                                onClick={() => {
                                    canvasBoard.SourceManager.SelectedSource = source;
                                }}
                            >
                                <Label className="flex-1"> {source.name}</Label>
                                <Icon
                                    name="Upload"
                                    size="18px"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        dataUploaderRef.current?.update(source);
                                    }}
                                />
                                <Icon
                                    name="X"
                                    size="18px"
                                    color="red"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        canvasBoard.SourceManager.removeSource(source.id);
                                    }}
                                />
                            </Badge>
                        ))}
                        <Button
                            size="xs"
                            variant="default"
                            className="w-full flex justify-center"
                            onClick={() => {
                                dataUploaderRef.current?.uploadNew();
                            }}
                        >
                            Add
                        </Button>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
});

export default CanvasOptions;
