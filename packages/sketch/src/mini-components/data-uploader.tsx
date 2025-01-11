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
    Button
} from "@now/ui";
import { ChartNow, useStore } from "@now/utils";
import { observer } from "mobx-react";
import { useState } from "react";

export const DataUploader = observer(function DataUploader({ id, component }: { id: string; component: ChartNow }) {
    const { uploadStore } = useStore();
    const [file, setFile] = useState<File | null>(null);
    const [opened, { close, open, toggle }] = useDisclosure(false);

    const upload = async () => {
        if (component.chart && file) {
            component.chart.ChartData = await uploadStore.UploadFile(file, id);
            // component.chart.DataVersion++;
            close();
        }
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
                <div className="h-40 relative flex items-center justify-center">
                    <label htmlFor={id} className="absolute z-50 flex items-center justify-center opacity-30">
                        {file ? file.name : "Upload file"}
                    </label>
                    <input
                        name={id}
                        id={id}
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
                <DialogFooter>
                    <Button onClick={upload}>Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});
