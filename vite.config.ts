import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // Emit relative asset URLs so the renderer can load from Electron's file:// URL.
  base: "./",
  plugins: [react()],
  cacheDir: "node_modules/.vite-myndos",
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    watch: {
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100,
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-dev-runtime",
      "react/jsx-runtime",
      "react-router-dom",
    ],
  },
});
