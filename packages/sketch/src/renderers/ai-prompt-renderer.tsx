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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Switch
} from "@now/ui";

import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { AiGenerator } from "@now/visualize";
import { Loader } from "lucide-react";
import { AiPrompt, isValidJson } from "@now/utils";
import { useDisclosure } from "@mantine/hooks";
import CodeEditor from "@uiw/react-textarea-code-editor";

import { ModelResponse, Ollama } from 'ollama';

const ollama = new Ollama({
  host: import.meta.env.VITE_OLLAMA_URL // Replace with your custom URL
});   

export const AiPromptRenderer = observer(function AiPromptRenderer({ component }: { component: AiPrompt }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [aiResult, setAiResult] = useState<string>("");
    const [useJson, setUseJson] = useState(false);
    const [models, setModels] = useState<ModelResponse[]>([]);
    const [selectedModel, setSelectedModel] = useState<ModelResponse | null>(null);
    const [json, setJson] = useState("");

    useEffect(() => {
        loadModels();
    }, []);

    const loadModels = async () => {
        const list = (await ollama.list()).models;
        setModels(list);
        setSelectedModel(list[0]);
    };

    const onChange = (value: string) => {
        component.Prompt = value;
    };

    async function generate() {
        if (!selectedModel) return;
        updateResult("");
        setLoading(true);
        try {
            if (useJson && json != null && json !== "") {
                const response = await ollama.generate({
                    model: selectedModel.name,
                    prompt: component.Prompt ?? "",
                    format: JSON.parse(json)
                });
                updateResult(response.response);
            } else {
                const response = await ollama.chat({
                    model: selectedModel.name,
                    messages: [{ role: "user", content: component.Prompt ?? "" }],
                    stream: true
                });
                const lines: string[] = [];
                for await (const part of response) {
                    lines.push(part.message.content);
                    updateResult(lines.join(""));
                }
            }
        } catch {
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
                    <div className="flex w-full justify-between gap-5 h-[26px]">
                        <Select
                            value={selectedModel?.name}
                            onValueChange={(v) => {
                                setSelectedModel(models.find((m) => m.name === v) ?? null);
                            }}
                        >
                            <SelectTrigger className="w-40 h-full">
                                <SelectValue placeholder="Select model..." />
                            </SelectTrigger>
                            <SelectContent>
                                {models.map((m) => (
                                    <SelectItem value={m.name}>{m.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex flex-row items-center gap-2 ">
                            <Label htmlFor="use-json">Use JSON</Label>

                            <Switch id="use-json" checked={useJson} onCheckedChange={(value) => setUseJson(value)} />
                        </div>
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

    const isValid = isValidJson(jsonContent);

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
                <div className="h-40 overflow-auto">
                    <CodeEditor
                        value={jsonContent}
                        language="json"
                        placeholder="Please enter the JSON"
                        onChange={(evn) => setJsonContent(evn.target.value)}
                        padding={15}
                        indentWidth={4}
                        minHeight={160}
                        style={{
                            width: "100%",
                            fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                        }}
                    />
                </div>
                <DialogFooter>
                    <Button
                        disabled={!isValid}
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
