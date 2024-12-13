import { AppLoader, Button, Icon } from "@now/ui";
import { ICanvasTransform } from "@now/utils";
import ollama from "ollama";

import { observer } from "mobx-react";
import { useEffect, useState } from "react";
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
    const [isLocked, setIsLocked] = useState(true);
    const aiPrompt = board.getAiPanel(id);
    const { x = 0, y = 0, h = 0, w = 0 } = aiPrompt.getValues();
    const [loading, setLoading] = useState<boolean>(false);
    const [aiResult, setAiResult] = useState<string>("");
    const { ax, ay } = CanvasHelper.getAbsolutePosition({ x, y }, transform);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        // const res = await uploadStore.GetData(id);
        // setData(res.data);
        setLoading(false);
    };

    const style: React.CSSProperties = {
        top: ay,
        left: ax,
        height: h * transform.scaleX,
        width: w * transform.scaleX,
        position: "absolute",
        display: "flex",
        // alignItems: "center",
        // justifyContent: "center",
        padding: 10,
        borderColor: "white",
        borderWidth: 1,
        flexDirection: "column",
        gap: 5
    };

    const onChange = async (value: string) => {
        aiPrompt.value = value;
    };

    function removeElement() {
        board.removeElement(id);
    }

    async function generate() {
        console.log("answer");
        const response = await ollama.chat({
            model: "gemma2:2b",
            messages: [{ role: "user", content: aiPrompt.value ?? "" }],
            stream: true
        });
        const lines: string[] = [];
        for await (const part of response) {
            lines.push(part.message.content);
            // setAiResult(lines);

            up(lines.join(""));
        }
    }
    const up = (val: string) => {
        setAiResult(val);
    };

    console.log(aiResult);
    return (
        <div className="z-[60]" style={style}>
            <p className="flex-1 overflow-auto w-full whitespace-break-spaces ">{aiResult}</p>
            <div className="max-h-[72px] w-full  flex items-end ">
                <div className="flex-1 h-full">
                    <AiGenerator value={aiPrompt.value ?? ""} onChange={onChange} />
                </div>
                <Button onClick={generate} size="icon" variant="ghost">
                    <Icon name="Sparkles" />
                </Button>
                <Button onClick={removeElement} size="icon" variant="destructive">
                    <Icon name="Trash2" />
                </Button>
            </div>
        </div>
    );
});
