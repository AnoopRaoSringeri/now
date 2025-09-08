/// <reference types='vitest' />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";
import mkcert from "vite-plugin-mkcert";
import eslint from "vite-plugin-eslint";
import checker from "vite-plugin-checker";

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
        react(),
        eslint(),
        nxViteTsPaths(),
        nxCopyAssetsPlugin(["*.md"]),
        checker({
            typescript: true
            // eslint: {
            //     lintCommand: 'eslint "./src/**/*.{ts,tsx,js,jsx}"'
            // }
        })
        // mkcert({
        //     savePath: "../../certs", // save the generated certificate into certs directory
        //     force: true // force generation of certs even without setting https property in the vite config
        // })
    ],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
        outDir: "../../dist/apps/now",
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
            transformMixedEsModules: true
        }
    }
});
