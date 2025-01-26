import {
    Chart,
    ColumnConfig,
    EditorValue,
    formatText,
    MultiColumnSelectValue,
    SingleColumnSelectValue
} from "@now/utils";
import { MultiColumnSelectEditor } from "../editors/multi-column-select-editor";
import { ColumnSelectEditor } from "../editors/column-select-editor";
import { observer } from "mobx-react";
import { Label } from "@now/ui";
export const ChartOptionsRendererWrapper = observer(function ChartOptionsRendererWrapper({ chart }: { chart: Chart }) {
    const { config, options } = chart;

    const columnConfig = chart.ColumnConfig;

    return (
        <div className="flex flex-col gap-4">
            <div>
                <Label>{formatText("dimension")}</Label>
                <ChartOptionsRenderer columns={columnConfig} editorValue={config.dimensions.v} option="dimension" />
            </div>
            <div>
                <Label>{formatText("measure")}</Label>
                <ChartOptionsRenderer columns={columnConfig} editorValue={config.measures.v} option="measure" />
            </div>
            {Object.keys(options).map((key) => (
                <div key={key}>
                    <Label>{formatText(key)}</Label>
                    <ChartOptionsRenderer option={key} editorValue={options[key]} columns={columnConfig} />
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
                    value={editorValue.Value as MultiColumnSelectValue}
                    columns={columns}
                />
            );
        case "scs":
            return (
                <ColumnSelectEditor
                    editorValue={editorValue}
                    option={option}
                    value={editorValue.Value as SingleColumnSelectValue}
                    columns={columns}
                />
            );
        default:
            return null;
    }
});
