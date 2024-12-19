import { AppBody } from "@now/ui";
import { SketchList } from "./sketch-view";
import { useNavigate } from "react-router";

export function SketchNow() {
    const navigate = useNavigate();
    return (
        <AppBody
            breadcrumbItems={[
                {
                    link: "#/sketch-now",
                    title: "Sketches"
                }
            ]}
            breadcrumbActions={[
                {
                    title: "New",
                    type: "button",
                    onClick: () => navigate("sketch/new")
                }
            ]}
        >
            <SketchList />
        </AppBody>
    );
}
