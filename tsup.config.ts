import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    clean: true,
    format: ["cjs", "esm", "iife"],
    dts: true,
    globalName: "IDBHelper",
    minify: "terser"
});
