import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app/app";
import "@now/styles/global.css";
import { ThemeProvider } from "@now/utils";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </StrictMode>
);
