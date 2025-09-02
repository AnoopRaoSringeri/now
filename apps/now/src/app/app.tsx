import NxWelcome from "./nx-welcome";
import { HashRouter, Route, Routes } from "react-router";
import { AppContainer } from "./app-container";
import { lazy, Suspense } from "react";
import { AppLoader } from "@now/ui";
import { Auth, ForgotPasswordPage, LogInPage, RegisterPage } from "@now/auth";

const BoardViewer = lazy(() => import("@now/sketch").then((module) => ({ default: module.BoardViewer })));
const CanvasBoard = lazy(() => import("@now/sketch").then((module) => ({ default: module.CanvasBoard })));
const SketchNow = lazy(() => import("@now/sketch").then((module) => ({ default: module.SketchNow })));

export function App() {
    return (
        <HashRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Suspense fallback={<AppLoader />}>
                            <Auth />
                        </Suspense>
                    }
                >
                    <Route
                        path="auth"
                        element={
                            <Suspense fallback={<AppLoader />}>
                                <LogInPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="register"
                        element={
                            <Suspense fallback={<AppLoader />}>
                                <RegisterPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="forgot-password"
                        element={
                            <Suspense fallback={<AppLoader />}>
                                <ForgotPasswordPage />
                            </Suspense>
                        }
                    />
                </Route>
                <Route
                    element={
                        <Suspense fallback={<AppLoader />}>
                            <AppContainer />
                        </Suspense>
                    }
                >
                    <Route path="sketch-now">
                        <Route
                            path=""
                            element={
                                <Suspense fallback={<AppLoader />}>
                                    <SketchNow />
                                </Suspense>
                            }
                        />
                        <Route
                            path="sketch/:id"
                            element={
                                <Suspense fallback={<AppLoader />}>
                                    <CanvasBoard />
                                </Suspense>
                            }
                        />
                        <Route
                            path="sketch-viewer/:id"
                            element={
                                <Suspense fallback={<AppLoader />}>
                                    <BoardViewer />
                                </Suspense>
                            }
                        />
                    </Route>
                    <Route path="/visualize-now" />
                    <Route path="/chat-now" />
                </Route>
                <Route path="/commands" element={<NxWelcome title="now" />} />
                <Route
                    path="/canvas/playground"
                    element={
                        <Suspense fallback={<AppLoader />}>
                            <CanvasBoard />
                        </Suspense>
                    }
                />
            </Routes>
        </HashRouter>
    );
}

export default App;
