import {
    Chart,
    ColumnConfig,
    EditorValue,
    formatText,
    MultiColumnSelectValue,
    MultiMeasureSelectValue,
    SingleColumnSelectValue,
    SingleMeasureSelectValue,
    SortConfig
} from "@now/utils";
import { MultiColumnSelectEditor } from "../editors/multi-column-select-editor";
import { ColumnSelectEditor } from "../editors/column-select-editor";
import { observer } from "mobx-react";
import { Label } from "@now/ui";
import { MeasureSelectEditor } from "../editors/measure-select-editor";
import { MultiMeasureSelectEditor } from "../editors/multi-measure-select-editor";
import { SortIcon } from "./sort-icon";

export const ChartOptionsRendererWrapper = observer(function ChartOptionsRendererWrapper({ chart }: { chart: Chart }) {
    const { config, options } = chart;

    const columnConfig = chart.ColumnConfig;

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="w-full">
                <Label>{formatText("dimension")}</Label>
                <ChartOptionsRenderer columns={columnConfig} editorValue={config.dimensions.v} option="dimension" />
            </div>
            <div className="w-full">
                <Label>{formatText("measure")}</Label>
                <ChartOptionsRenderer columns={columnConfig} editorValue={config.measures.v} option="measure" />
            </div>
            {Object.keys(options).map((key) => (
                <div key={key} className="w-full">
                    <Label>{formatText(key)}</Label>
                    <ChartOptionsRenderer option={key} editorValue={options[key]} columns={columnConfig} />
                </div>
            ))}
            <div className="w-full">
                <Label>{formatText("sort")}</Label>
                <SortConfigRenderer sortConfig={chart.SortConfig} chart={chart} />
            </div>
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
        case "sms":
            return (
                <MeasureSelectEditor
                    editorValue={editorValue}
                    option={option}
                    value={editorValue.Value as SingleMeasureSelectValue}
                    columns={columns}
                />
            );
        case "mms":
            return (
                <MultiMeasureSelectEditor
                    editorValue={editorValue}
                    option={option}
                    value={editorValue.Value as MultiMeasureSelectValue}
                    columns={columns}
                />
            );
        default:
            return null;
    }
});

const SortConfigRenderer = observer(function SortConfigRenderer({
    sortConfig,
    chart
}: {
    sortConfig: SortConfig[];
    chart: Chart;
}) {
    return (
        <div className="max-h-[200px] flex flex-col overflow-auto gap-1">
            {chart.UsedColumns.map((c) => (
                <div
                    className="cursor-pointer flex flex-row h-8 gap-2 items-center bg-background px-4 py-1 rounded"
                    onClick={() => {
                        chart.toggleSort(c.name);
                    }}
                >
                    <SortIcon sort={sortConfig.find((sc) => sc.column === c.name) ?? null} />
                    <Label varient="small">{c.name}</Label>
                </div>
            ))}
        </div>
    );
});
