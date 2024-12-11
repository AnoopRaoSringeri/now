import { CanvasBoard, SketchNow } from "@now/sketch";
import NxWelcome from "./nx-welcome";
import { HashRouter, Route, Routes } from "react-router";
import { AppContainer } from "./app-container";
import { Suspense } from "react";
import { AppLoader } from "@now/ui";
import { Auth, ForgotPasswordPage, LogInPage, RegisterPage } from "@now/auth";

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
                    </Route>
                    <Route path="/visualize-now" />
                    <Route path="/chat-now" />
                </Route>
                <Route path="/commands" element={<NxWelcome title="now" />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
