import { SketchNow } from "@now/sketch";
import NxWelcome from "./nx-welcome";
import { HashRouter, Route, Routes } from "react-router";
import { AppContainer } from "./app-container";
import { Suspense } from "react";
import { AppLoader } from "@now/ui";

export function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/auth" element={<SketchNow />}>
                    <Route path="commands" element={<NxWelcome title="now" />} />
                </Route>
                <Route
                    path="/"
                    element={
                        <Suspense fallback={<AppLoader />}>
                            <AppContainer />
                        </Suspense>
                    }
                >
                    <Route
                        path="/sketch-now"
                        element={
                            <Suspense fallback={<AppLoader />}>
                                <SketchNow />
                            </Suspense>
                        }
                    />
                    <Route path="/visualize-now" />
                    <Route path="/chat-now" />
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default App;
