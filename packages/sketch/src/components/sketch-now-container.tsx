import { AppBody } from "@now/ui";
import { SketchList } from "./sketch-view";

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
            <SketchList />
        </AppBody>
    );
}
