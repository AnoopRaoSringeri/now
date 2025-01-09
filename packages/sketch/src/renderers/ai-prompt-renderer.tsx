import { Button, Icon } from "@now/ui";
import ollama from "ollama";

import { observer } from "mobx-react";
import { useState } from "react";
import { AiGenerator } from "@now/visualize";
import { Loader } from "lucide-react";
import { AiPrompt } from "@now/utils";

export const AiPromptRenderer = observer(function AiPromptRenderer({ component }: { component: AiPrompt }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [aiResult, setAiResult] = useState<string>("");

    const onChange = (value: string) => {
        component.Prompt = value;
    };

    async function generate() {
        setLoading(true);
        const response = await ollama.chat({
            model: "gemma2:2b",
            messages: [{ role: "user", content: component.Prompt ?? "" }],
            stream: true
        });
        const lines: string[] = [];
        for await (const part of response) {
            lines.push(part.message.content);
            updateResult(lines.join(""));
        }
    }
    const updateResult = (val: string) => {
        setLoading(false);
        setAiResult(val);
    };

    return (
        <>
            <p className="flex-1 overflow-auto w-full whitespace-break-spaces ">{aiResult}</p>
            <div className="max-h-[72px] w-full  flex items-end z-30">
                <div className="flex-1 h-full">
                    <AiGenerator value={component.Prompt ?? ""} onChange={onChange} />
                </div>
                <Button onClick={generate} size="icon" variant="ghost" disabled={loading}>
                    {loading ? <Loader className="animate-spin" /> : <Icon name="Sparkles" />}
                </Button>
            </div>
        </>
    );
});
