import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["src/index.ts"],
        clean: true,
        format: ["cjs", "esm"],
        dts: true,
    },
    {
        entry: ["src/index.ts"],
        clean: false,
        format: ["iife"],
        minify: true,
        dts: false,
        sourcemap: true,
    },
]);
