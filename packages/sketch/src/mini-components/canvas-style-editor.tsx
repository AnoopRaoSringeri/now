import { observer } from "mobx-react";
import { useParams } from "react-router";

import { Renderer } from "../renderers/editor-renderer";
import { OptionsWrapper } from "./options-wrapper";
import { useCanvas } from "../hooks/use-canvas";
import { ScrollArea, ScrollBar } from "@now/ui";
import { ElementEnum } from "@now/utils";
import { OptionRegistry } from "../helpers/option-registry";

export const StyleEditorWrapper = observer(function StyleEditorWrapper() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");

    return (
        <div className="absolute left-5 top-20 z-[10]  flex  flex-row items-center gap-1">
            <ScrollArea>
                {(canvasBoard.ElementType === ElementEnum.Move || canvasBoard.ElementType === ElementEnum.Pan) &&
                canvasBoard.SelectedElements.length === 0 ? null : (
                    <div className="flex h-full w-[225px] flex-col gap-4 rounded-sm bg-slate-500 p-5">
                        {canvasBoard.ElementType === ElementEnum.Move ? null : <CanvasStyleEditor />}
                        <ElementStyleEditor />
                        <OptionsWrapper />
                    </div>
                )}
                <ScrollBar />
            </ScrollArea>
        </div>
    );
});

const CanvasStyleEditor = observer(function CanvasStyleEditor() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");
    const canvasStyle = canvasBoard.Style;

    const options = OptionRegistry[canvasBoard.ElementType];
    return options.length > 0 ? (
        <>
            {options.map((o, i) => (
                <Renderer
                    key={i}
                    {...o}
                    value={canvasStyle[o.optionKey]}
                    onChange={(key, value) => canvasBoard.setStyle(key, value)}
                />
            ))}
        </>
    ) : null;
});

const ElementStyleEditor = observer(function ElemntStyleEditor() {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");
    const selectedElements = canvasBoard.SelectedElements;
    const element = selectedElements[0];
    const elementStyle = element?.style;

    if (!elementStyle) {
        return null;
    }

    const options = OptionRegistry[element.Type];

    return options.length > 0 ? (
        <>
            {options.map((o, i) => (
                <Renderer
                    key={i}
                    {...o}
                    value={elementStyle[o.optionKey]}
                    onChange={(key, value) => canvasBoard.updateStyle(key, value)}
                />
            ))}
        </>
    ) : null;
});
