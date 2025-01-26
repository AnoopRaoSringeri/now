import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app/app";
import "@now/styles/global.css";
import { StoreProvider, ThemeProvider } from "@now/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, ToastProvider } from "@now/ui";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const queryClient = new QueryClient();

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <StoreProvider>
                <ThemeProvider>
                    <ToastProvider>
                        <App />
                        <Toaster />
                    </ToastProvider>
                </ThemeProvider>
            </StoreProvider>
        </QueryClientProvider>
    </StrictMode>
);
