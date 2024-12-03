import { Sketch } from "@now/sketch";
import NxWelcome from "./nx-welcome";
import { HashRouter, Route, Routes } from "react-router";

export function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Sketch />} />
                <Route path="/commands" element={<NxWelcome title="now" />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
