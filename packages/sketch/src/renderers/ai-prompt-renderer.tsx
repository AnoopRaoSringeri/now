import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Icon,
    Label,
    Switch
} from "@now/ui";
import ollama from "ollama";

import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { AiGenerator } from "@now/visualize";
import { Loader } from "lucide-react";
import { AiPrompt } from "@now/utils";
import { useDisclosure } from "@mantine/hooks";
import CodeEditor from "@uiw/react-textarea-code-editor";

export const AiPromptRenderer = observer(function AiPromptRenderer({ component }: { component: AiPrompt }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [aiResult, setAiResult] = useState<string>("");
    const [useJson, setUseJson] = useState(false);
    const [json, setJson] = useState("");

    const onChange = (value: string) => {
        component.Prompt = value;
    };

    async function generate() {
        updateResult("");
        setLoading(true);
        try {
            if (json != null && json !== "") {
                const response = await ollama.generate({
                    model: "gemma2:2b",
                    prompt: component.Prompt ?? "",
                    format: json
                });
                updateResult(response.response);
            } else {
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
        } catch (e) {
            setLoading(false);
        }
    }

    const updateResult = (val: string) => {
        setLoading(false);
        setAiResult(val);
    };

    return (
        <>
            <p className="flex-1 overflow-auto w-full whitespace-break-spaces ">{aiResult}</p>
            <div className="h-[88px] w-full  flex items-end z-[3] gap-1">
                <div className="flex flex-col items-end flex-1 h-full">
                    <div className="flex flex-row items-center gap-2 ">
                        <Label htmlFor="use-json">Use JSON</Label>
                        <Switch id="use-json" checked={useJson} onCheckedChange={(value) => setUseJson(value)} />
                    </div>

                    <AiGenerator value={component.Prompt ?? ""} onChange={onChange} />
                </div>
                <div className="flex flex-col gap-2">
                    {useJson ? <JsonInput json={json} onChange={setJson} /> : null}
                    <Button onClick={generate} size="icon" variant="ghost" disabled={loading}>
                        {loading ? <Loader className="animate-spin" /> : <Icon name="Sparkles" />}
                    </Button>
                </div>
            </div>
        </>
    );
});

export const JsonInput = observer(function JsonInput({
    json,
    onChange
}: {
    json: string;
    onChange: (json: string) => unknown;
}) {
    const [jsonContent, setJsonContent] = useState("");
    const [opened, { close, open, toggle }] = useDisclosure(false);
    useEffect(() => {
        setJsonContent(json);
    }, [json]);

    return (
        <Dialog onOpenChange={toggle} open={opened}>
            <DialogTrigger size="icon" variant="ghost" onClick={open}>
                <Icon name="Braces" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add the JSON format</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <div className="h-40 relative flex items-center justify-center">
                    <CodeEditor
                        value={jsonContent}
                        language="json"
                        placeholder="Please enter the JSON"
                        onChange={(evn) => setJsonContent(evn.target.value)}
                        padding={15}
                        indentWidth={4}
                        style={{
                            overflow: "auto",
                            width: "100%",
                            height: "100%",
                            fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                        }}
                    />
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            console.log(jsonContent);
                            onChange(jsonContent);
                            close();
                        }}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});
