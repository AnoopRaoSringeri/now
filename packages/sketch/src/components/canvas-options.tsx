import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ElementSelector from "./element-selector";
import { Button, Input } from "@now/ui";
import { Expand, House, Save } from "lucide-react";
import { useCanvas } from "../hooks/use-canvas";
import { StyleEditorWrapper } from "../mini-components/canvas-style-editor";
import { ZoomController } from "../mini-components/zoom-controller";

const CanvasOptions = observer(function CanvasOptions({ name, onExpand }: { name: string; onExpand?: () => unknown }) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [sketchName, setSketchName] = useState(name);
    const { canvasBoard } = useCanvas(id ?? "new");

    useEffect(() => {
        setSketchName(name);
    }, [name]);

    const saveBoard = async () => {
        console.log(canvasBoard.Canvas.toDataURL());
    };

    const goToHome = () => {
        navigate("/sketches");
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
                        <Button size="sm" onClick={() => saveBoard()}>
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
