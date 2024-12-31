import { Chart, ColumnConfig, EditorValue, formatText } from "@now/utils";
import { MultiColumnSelectEditor } from "../editors/multi-column-select-editor";
import { ColumnSelectEditor } from "../editors/column-select-editor";
import { observer } from "mobx-react";
import { Label } from "@now/ui";
export const ChartOptionsRendererWrapper = observer(function ChartOptionsRendererWrapper({ chart }: { chart: Chart }) {
    const { config, columnConfig } = chart;

    return (
        <div className="flex flex-col gap-4">
            {Object.keys(config).map((key) => (
                <div key={key}>
                    <Label>{formatText(key)}</Label>
                    <ChartOptionsRenderer option={key} editorValue={config[key]} columns={columnConfig} />
                </div>
            ))}
        </div>
    );
});

const ChartOptionsRenderer = observer(function ChartOptionsRenderer({
    editorValue,
    option,
    columns
}: {
    editorValue: EditorValue;
    option: string;
    columns: ColumnConfig[];
}) {
    switch (editorValue.value.t) {
        case "mcs":
            return (
                <MultiColumnSelectEditor
                    editorValue={editorValue}
                    option={option}
                    value={editorValue.value}
                    columns={columns}
                />
            );
        case "scs":
            return (
                <ColumnSelectEditor
                    editorValue={editorValue}
                    option={option}
                    value={editorValue.value}
                    columns={columns}
                />
            );
        default:
            return null;
    }
});
