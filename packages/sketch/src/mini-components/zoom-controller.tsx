import { Button, Label } from "@now/ui";
import { Minus, Plus, Scan, Search } from "lucide-react";
import { observer } from "mobx-react";
import { useParams } from "react-router";
import { useCanvas } from "../hooks/use-canvas";

export const ZoomController = function ZoomController() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");

    function zoomIn() {
        canvasBoard.UiStateManager.zoomIn();
    }

    function zoomOut() {
        canvasBoard.UiStateManager.zoomOut();
    }

    function fitToView() {
        canvasBoard.UiStateManager.fitToView();
    }

    return (
        <div className="absolute bottom-5 right-5 z-10  flex  flex-row items-center gap-1">
            <Search size={40} />
            <ZoomLabel canvasBoard={canvasBoard} />
            <Button size="xs" variant="simple" onClick={zoomIn}>
                <Plus size={20} />
            </Button>
            <Button size="xs" variant="simple" onClick={zoomOut}>
                <Minus size={20} />
            </Button>
            <Button size="xs" variant="simple" onClick={fitToView}>
                <Scan size={20} />
            </Button>
        </div>
    );
};

const ZoomLabel = observer(({ canvasBoard }) => {
    return <Label className="p-1 text-lg">{canvasBoard.Zoom.toFixed(2)}%</Label>;
});
