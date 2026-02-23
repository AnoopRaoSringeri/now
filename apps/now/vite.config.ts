/// <reference types="vitest" />
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: __dirname,
    cacheDir: "../../node_modules/.vite/apps/now",
    server: {
        port: 4200,
        host: "0.0.0.0",
        allowedHosts: true
    },
    preview: {
        port: 4300,
        host: "localhost"
    },
    plugins: [
        react({
            babel: {
                plugins: ["babel-plugin-react-compiler"]
            }
        }),
        nxViteTsPaths(),
        nxCopyAssetsPlugin(["*.md"]),
        checker({
            typescript: true
        }),
        tailwindcss()
    ],
    build: {
        outDir: "../../dist/apps/now",
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
            transformMixedEsModules: true
        },
        sourcemap: false,
        minify: "esbuild"
    }
});
