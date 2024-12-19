import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ElementSelector from "./element-selector";
import { Button, Input } from "@now/ui";
import { Expand, House, Save } from "lucide-react";
import { useCanvas } from "../hooks/use-canvas";
import { StyleEditorWrapper } from "../mini-components/canvas-style-editor";
import { ZoomController } from "../mini-components/zoom-controller";
import { useStore } from "@now/utils";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const CanvasOptions = observer(function CanvasOptions({ name, onExpand }: { name: string; onExpand?: () => unknown }) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [sketchName, setSketchName] = useState(name);
    const { canvasBoard } = useCanvas(id ?? "new");
    const { sketchStore } = useStore();

    useEffect(() => {
        setSketchName(name);
    }, [name]);

    const saveBoard = async () => {
        console.log(canvasBoard.Canvas.toDataURL());
        if (id && id != "new") {
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
                navigate(`/sketch/${response._id}`);
            }
        }
    };

    const { mutate, isPending } = useMutation({
        mutationFn: () => saveBoard()
    });

    const goToHome = () => {
        navigate("/sketch-now");
    };

    return (
        <div className="absolute flex size-full overflow-hidden bg-transparent">
            <div className=" flex size-full items-center justify-center bg-transparent">
                <ElementSelector
                    onChange={(eleType) => {
                        canvasBoard.ElementType = eleType;
                    }}
                />
                <div className="absolute right-5 top-5 z-[100]">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="Name"
                            value={sketchName}
                            onChange={(e) => {
                                setSketchName(e.target.value);
                            }}
                        />
                        <Button size="sm" onClick={() => mutate()} loading={isPending}>
                            <Save />
                        </Button>
                    </div>
                </div>
                <div className="absolute left-5 top-5 z-[100] gap-1 flex ">
                    <Button size="sm" onClick={goToHome}>
                        <House size="20px" />
                    </Button>
                    <Button size="sm" onClick={onExpand}>
                        <Expand size="20px" />
                    </Button>
                </div>
                <StyleEditorWrapper />
                <ZoomController />
            </div>
        </div>
    );
});

export default CanvasOptions;
