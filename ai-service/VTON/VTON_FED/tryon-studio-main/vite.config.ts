import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// AuraFit — Virtual Try-On
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/garments": { target: "http://localhost:8000", changeOrigin: true },
      "/output": { target: "http://localhost:8000", changeOrigin: true },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
