import { AppLoader, Button, Icon } from "@now/ui";
import { ElementEnum, ICanvasObjectWithId, ICanvasTransform, useStore } from "@now/utils";
import { BarChart } from "@now/visualize";

import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { CanvasBoard } from "../canvas/canvas-board";
import { CanvasHelper } from "../helpers/canvas-helpers";

export type RendererType = React.ComponentType<{
    id: string;
    board: CanvasBoard;
}>;

export const CustomComponentRendererWrapper = observer(function CustomComponentRendererWrapper({
    id,
    board
}: {
    id: string;
    board: CanvasBoard;
}) {
    const component = board.getComponent(id);
    switch (component.type) {
        case ElementEnum.AiPrompt:
            return <></>;
        case ElementEnum.Chart:
            return <CustomComponentRenderer board={board} component={component} />;
    }
});
export const CustomComponentRenderer = observer(function CustomComponentRenderer({
    component,
    board
}: {
    component: ICanvasObjectWithId;
    board: CanvasBoard;
}) {
    const { x = 0, y = 0, h = 0, w = 0 } = component.getValues();
    const [isLocked, setIsLocked] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<string[][]>([]);
    const { uploadStore } = useStore();
    const transform = board.Transform;
    const { ax, ay } = CanvasHelper.getAbsolutePosition({ x, y }, transform);
    const id = component.id;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const res = await uploadStore.GetData(id);
        setData(res.data);
        setLoading(false);
    };

    const style: React.CSSProperties = {
        top: ay,
        left: ax,
        height: h * transform.scaleX,
        width: w * transform.scaleX,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        zoom: transform.scaleX
    };

    const upload = async (file: File, id: string) => {
        setLoading(true);
        const res = await uploadStore.UploadFile(file, id);
        setData(res.data);
        setLoading(false);
    };

    const headers: string[] = data.length > 0 ? data[0] : [];

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
            <AppLoader />
            {data.length > 0 ? (
                <>
                    {/* <CutomTable
                        headers={headers}
                        data={data}
                        style={{
                            zoom: transform.scaleX
                        }}
                    /> */}
                    <BarChart />
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
