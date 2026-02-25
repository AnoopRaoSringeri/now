import "./styles.css";
import { queryClient, StoreProvider, ThemeProvider } from "@now/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

import { Toaster as Sonner } from "sonner";
import App from "./app/app";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster, ToastProvider } from "@now/ui";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <StoreProvider>
                <ThemeProvider>
                    <ToastProvider>
                        <App />
                        <Toaster />
                        <Sonner />
                        {import.meta.env.MODE === "development" ? (
                            <ReactQueryDevtools buttonPosition="bottom-left" position="left" initialIsOpen={false} />
                        ) : null}
                    </ToastProvider>
                </ThemeProvider>
            </StoreProvider>
        </QueryClientProvider>
    </StrictMode>
);
