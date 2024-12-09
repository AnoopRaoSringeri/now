import { observer } from "mobx-react";
import { useParams } from "react-router";

import { ElementOptions } from "./element-options";
import { SelectionOptions } from "./selection-options";
import { useCanvas } from "../hooks/use-canvas";

export const OptionsWrapper = observer(function OptionsWrapper() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");
    return <> {canvasBoard.SelectionElement ? <SelectionOptions /> : <ElementOptions />}</>;
});
