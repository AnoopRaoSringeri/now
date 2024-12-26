import { AppLoader, Button, Icon } from "@now/ui";
import { ChartData, ICanvasTransform, useStore } from "@now/utils";
import { BarChart, CutomTable, PieChart } from "@now/visualize";

import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { CanvasBoard } from "../canvas/canvas-board";
import { CanvasHelper } from "../helpers/canvas-helpers";

export const TableRenderer = observer(function TableRenderer({
    transform,
    id,
    board
}: {
    transform: ICanvasTransform;
    id: string;
    board: CanvasBoard;
}) {
    const [isLocked, setIsLocked] = useState(true);
    const table = board.getComponent(id);
    const { x = 0, y = 0, h = 0, w = 0 } = table.getValues();
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<ChartData | null>(null);
    const { uploadStore } = useStore();
    const { ax, ay } = CanvasHelper.getAbsolutePosition({ x, y }, transform);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const res = await uploadStore.GetData(id);
        setData(res);
        setLoading(false);
    };

    const style: React.CSSProperties = {
        top: ay,
        left: ax,
        // height: h,
        // width: w,
        height: h * transform.scaleX,
        width: w * transform.scaleX,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 10
        // transform: `scale(${transform.scaleX})`,
        // zoom: transform.scaleX
    };

    const upload = async (file: File, id: string) => {
        setLoading(true);
        const res = await uploadStore.UploadFile(file, id);
        setData(res);
        setLoading(false);
    };

    function removeElement() {
        board.removeElement(id);
    }

    return (
        <div style={style}>
            <div className="absolute bottom-5 right-5 z-[60]">
                <Button onClick={() => setIsLocked((pre) => !pre)} size="icon" variant="ghost">
                    {isLocked ? <Icon name="LockOpen" /> : <Icon name="Lock" />}
                </Button>
                <Button onClick={removeElement} size="icon" variant="destructive">
                    <Icon name="Trash2" />
                </Button>
            </div>
            <AppLoader loading={loading} />
            {data && data.columns.length > 0 ? (
                <>
                    <CutomTable
                        headers={data.columns}
                        data={data.data}
                        style={{
                            zoom: transform.scaleX
                        }}
                    />
                    {/* <BarChart chartData={data} /> */}
                    {/* <PieChart /> */}
                </>
            ) : loading ? null : (
                <>
                    <label htmlFor={id} className="absolute z-50 flex items-center justify-center opacity-30">
                        Upload file
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
                                upload(e.target.files[0], id);
                            }
                        }}
                    />
                </>
            )}
        </div>
    );
});
