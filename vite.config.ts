import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import lucidePreprocess from "vite-plugin-lucide-preprocess";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [lucidePreprocess(), solid(), tailwindcss()],
  build: {
    minify: false,
    lib: {
      entry: "src/index.tsx",
      fileName: "_kiku",
      formats: ["es"],
    },
    copyPublicDir: false,
  },
});
