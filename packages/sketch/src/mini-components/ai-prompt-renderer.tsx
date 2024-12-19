import { Button, Icon } from "@now/ui";
import { ICanvasTransform } from "@now/utils";
import ollama from "ollama";

import { observer } from "mobx-react";
import { useState } from "react";
import { CanvasBoard } from "../canvas/canvas-board";
import { CanvasHelper } from "../helpers/canvas-helpers";
import { AiGenerator } from "@now/visualize";

export const AiPromptRenderer = observer(function AiPromptRenderer({
    transform,
    id,
    board
}: {
    transform: ICanvasTransform;
    id: string;
    board: CanvasBoard;
}) {
    const aiPrompt = board.getComponent(id);
    const { x = 0, y = 0, h = 0, w = 0 } = aiPrompt.getValues();
    const [loading, setLoading] = useState<boolean>(false);
    const [aiResult, setAiResult] = useState<string>("");
    const { ax, ay } = CanvasHelper.getAbsolutePosition({ x, y }, transform);

    const style: React.CSSProperties = {
        top: ay,
        left: ax,
        height: h * transform.scaleX,
        width: w * transform.scaleX,
        position: "absolute",
        display: "flex",
        padding: 10,
        borderColor: "white",
        borderWidth: 1,
        flexDirection: "column",
        gap: 5
    };

    const onChange = (value: string) => {
        aiPrompt.value = value;
    };

    function removeElement() {
        board.removeElement(id);
    }

    async function generate() {
        if (aiPrompt.value == null) return;
        setLoading(true);
        const response = await ollama.chat({
            model: "gemma2:2b",
            messages: [{ role: "user", content: aiPrompt.value ?? "" }],
            stream: true
        });
        onChange("");
        const lines: string[] = [];
        for await (const part of response) {
            setLoading(false);
            lines.push(part.message.content);
            update(lines.join(""));
        }
    }
    const update = (val: string) => {
        setAiResult(val);
    };

    return (
        <div style={style}>
            <div
                className="size-full flex flex-col"
                style={{
                    zoom: transform.scaleX
                }}
            >
                <p className="flex-1 overflow-auto w-full whitespace-break-spaces ">{aiResult}</p>
                <div className="max-h-[74px] w-full  flex items-end gap-2 z-[60]">
                    <div className="flex-1 h-full ">
                        <AiGenerator value={aiPrompt.value ?? ""} onChange={onChange} />
                    </div>
                    <div className="flex flex-wrap flex-col">
                        <Button onClick={generate} size="icon" variant="ghost">
                            {loading ? <Icon name="Loader" spin /> : <Icon name="Sparkles" />}
                        </Button>
                        <Button onClick={removeElement} size="icon" variant="destructive">
                            <Icon name="Trash2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});
