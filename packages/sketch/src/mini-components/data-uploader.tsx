import { useDisclosure } from "@mantine/hooks";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Icon,
    DialogDescription,
    DialogFooter,
    Button,
    Label,
    RadioGroup,
    RadioGroupItem,
    Input
} from "@now/ui";
import { ChartDataUpdateMode, ChartNow, useStore } from "@now/utils";
import { observer } from "mobx-react";
import { useState } from "react";

export const DataUploader = observer(function DataUploader({ id, component }: { id: string; component: ChartNow }) {
    const { uploadStore } = useStore();
    const [file, setFile] = useState<File | null>(null);
    const [mode, setMode] = useState<ChartDataUpdateMode>("insert");
    const [opened, { close, open, toggle }] = useDisclosure(false);

    const upload = async () => {
        if (component.chart && file) {
            if (component.chart.Source.id) {
                if (component.chart.Source.type === "File") {
                    await uploadStore.UpdateData(file, component.chart.Source.id, mode);
                    component.chart.DataVersion++;
                }
            } else {
                const response = await uploadStore.UploadFile(file);
                component.chart.ChartData = response;
                component.chart.Source = { name: component.chart.Source.name, type: "File", id: response.id };
            }
        }
        onClose();
    };

    const onClose = () => {
        close();
        setFile(null);
    };

    return (
        <Dialog onOpenChange={toggle} open={opened}>
            <DialogTrigger size="icon" variant="ghost" onClick={open}>
                <Icon name="Upload" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload data to chart</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="Name"
                        type="text"
                        value={component.chart.Source.name}
                        onChange={(e) => {
                            component.chart.Source.name = e.target.value;
                        }}
                    />
                    {component.chart.Source.id ? (
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
                    ) : null}
                    <div className="h-40 relative flex items-center justify-center">
                        <label
                            htmlFor={component.id}
                            className="absolute z-50 flex items-center justify-center opacity-30"
                        >
                            {file ? file.name : "Upload file"}
                        </label>
                        <input
                            name={component.id}
                            id={component.id}
                            className="absolute z-50 size-full border-2 border-dashed border-gray-50/20 text-transparent  file:hidden"
                            type="file"
                            title=" "
                            value={""}
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setFile(e.target.files[0]);
                                }
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={upload}>Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});
