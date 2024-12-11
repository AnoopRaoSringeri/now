import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app/app";
import "@now/styles/global.css";
import { StoreProvider, ThemeProvider } from "@now/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const queryClient = new QueryClient();

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <StoreProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </StoreProvider>
        </QueryClientProvider>
    </StrictMode>
);
