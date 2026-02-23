import { useDisclosure } from "@mantine/hooks";
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    RadioGroup,
    RadioGroupItem,
    Switch
} from "@now/ui";
import { ChartDataUpdateMode, ChartSource, SourceManager, useStore } from "@now/utils";
import { observer } from "mobx-react";
import React, { useImperativeHandle, useState } from "react";

export type DataUploaderHandle = {
    uploadNew: () => void;
    update: (source: ChartSource) => void;
};

export const DataUploader = observer(
    React.forwardRef<DataUploaderHandle, { sourceManager: SourceManager }>(function DataUploader(
        { sourceManager },
        ref
    ) {
        const { uploadStore } = useStore();
        const [file, setFile] = useState<File | null>(null);
        const [source, setSource] = useState<ChartSource | null>(null);
        const [mode, setMode] = useState<ChartDataUpdateMode>("insert");
        const [opened, { close, open, toggle }] = useDisclosure(false);
        const [name, setName] = useState("");
        const [loading, setLoading] = useState(false);
        const [isFirstRowHeader, setIsFirstRowHeader] = useState(false);

        useImperativeHandle(ref, () => ({
            uploadNew: () => {
                open();
            },
            update: (source) => {
                open();
                setSource(source);
                setName(source.name);
            }
        }));

        const upload = async () => {
            setLoading(true);
            if (file) {
                if (source == null) {
                    const response = await uploadStore.UploadFile(file);
                    sourceManager.addSource({
                        type: "File",
                        id: response.id,
                        name,
                        columns: response.columns
                    });
                } else {
                    await uploadStore.UpdateData(file, source.id, mode, isFirstRowHeader);
                    const ix = sourceManager.Sources.findIndex((s) => s.id === source.id);
                    sourceManager.Sources[ix].name = name;
                    sourceManager.refreshLinkedElements();
                }
            }
            onClose();
        };

        const onClose = () => {
            close();
            setFile(null);
            setLoading(false);
            setName("");
            setSource(null);
        };

        return (
            <Dialog onOpenChange={toggle} open={opened}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload data to chart</DialogTitle>
                        <DialogDescription />
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <Input
                            placeholder="Name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                        {source ? (
                            <>
                                <RadioGroup
                                    defaultValue={mode}
                                    onValueChange={(value: ChartDataUpdateMode) => setMode(value)}
                                    className="flex-row"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="truncate" id="truncate" />
                                        <Label htmlFor="truncate">Truncate</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="insert" id="insert" />
                                        <Label htmlFor="insert">Insert</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="upsert" id="upsert" />
                                        <Label htmlFor="upsert">Upsert</Label>
                                    </div>
                                </RadioGroup>
                                <div className="flex flex-row items-center gap-2 ">
                                    <Label htmlFor="with-header">With header</Label>
                                    <Switch
                                        id="with-heade"
                                        checked={isFirstRowHeader}
                                        onCheckedChange={(value) => setIsFirstRowHeader(value)}
                                    />
                                </div>
                            </>
                        ) : null}

                        <div className="h-40 relative flex items-center justify-center">
                            <label
                                htmlFor="source"
                                className="absolute z-5 flex items-center justify-center opacity-30"
                            >
                                {file ? file.name : "Upload file"}
                            </label>
                            <input
                                name="source"
                                id="source"
                                className="absolute z-5 size-full border-2 border-dashed border-gray-50/20 text-transparent  file:hidden"
                                type="file"
                                title=" "
                                value={""}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const selectedFile = e.target.files[0];
                                        if (source == null) {
                                            setName(selectedFile.name.split(".")[0]);
                                        }
                                        setFile(selectedFile);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={upload} loading={loading}>
                            Upload
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    })
);
