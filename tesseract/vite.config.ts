import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
  ],
  define: {
    "process.env": {},
  },
  base: "/utils/tesseract/",
  build: {
    outDir: path.join(__dirname, "../dists/tesseract"),
    sourcemap: "inline",
  },
});
