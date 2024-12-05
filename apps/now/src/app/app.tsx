import { Layout } from "@now/sketch";
import NxWelcome from "./nx-welcome";
import { HashRouter, Route, Routes } from "react-router";

export function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout />} />
                <Route path="/commands" element={<NxWelcome title="now" />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
