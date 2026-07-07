/// <reference types="node" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    fs: {
      // The dev server is launched via the 8.3 short path (C:\CLAUDE~1\SPRITE~1)
      // which fails Vite's long-path allowlist comparison on Windows.
      strict: false,
    },
  },
});
