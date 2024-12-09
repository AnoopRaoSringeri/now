import { AppBody } from "@now/ui";
import { CanvasBoard } from "./canvas-board";

export function SketchNow() {
    return (
        <AppBody
            breadcrumbItems={[
                {
                    link: "#/sketch-now",
                    title: "Sketches"
                }
            ]}
        >
            <CanvasBoard />
        </AppBody>
    );
}
