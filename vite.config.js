import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';
import path from "path";

const isDev = process.env.NODE_ENV === "development";

console.log(isDev);

export default defineConfig({
    plugins: [dts()],
    esbuild: {
        drop: ['console', 'debugger'] , //isDev ? ['console', 'debugger'] : [],
    },
    build: {
        outDir: path.join(__dirname, "lib"),
        lib: {
            entry: [path.join(__dirname, "src/index.ts"), path.join(__dirname, "src/styles/style.scss")],
            name: 'fullslide',
            fileName: 'FullSlide',
        }
    }
})