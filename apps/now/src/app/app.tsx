import { Auth, ForgotPasswordPage, LogInPage, RegisterPage } from "@now/auth";
import { AppLoader } from "@now/ui";
import { useAuth } from "@now/utils";
import { lazy, ReactNode, Suspense, useEffect } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router";
import { AppContainer } from "./app-container";

const BoardViewer = lazy(() => import("@now/sketch").then((module) => ({ default: module.BoardViewer })));
const CanvasBoard = lazy(() => import("@now/sketch").then((module) => ({ default: module.CanvasBoard })));
const SketchNow = lazy(() => import("@now/sketch").then((module) => ({ default: module.SketchNow })));

export function App() {
    return (
        <HashRouter>
            <Suspense fallback={<AppLoader />}>
                <Routes>
                    <Route path="/" element={<Auth />}>
                        <Route path="" element={<Navigate to="/auth" />} />
                        <Route path="auth" element={<LogInPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    </Route>
                    <Route path="sketch-now">
                        <Route
                            path=""
                            element={
                                <AppContainer>
                                    <SketchNow />
                                </AppContainer>
                            }
                        />
                        <Route path="sketch/:id" element={<SuspenseComponentLoader children={<CanvasBoard />} />} />
                        <Route
                            path="sketch-viewer/:id"
                            element={<SuspenseComponentLoader children={<BoardViewer />} />}
                        />
                    </Route>
                    <Route path="/canvas/playground" element={<CanvasBoard />} />
                </Routes>
            </Suspense>
        </HashRouter>
    );
}
const SuspenseComponentLoader = ({ children }: { children: ReactNode }) => {
    const { refreshToken } = useAuth();

    useEffect(() => {
        refreshToken();
    }, [refreshToken]);

    return <>{children}</>;
};

export default App;
