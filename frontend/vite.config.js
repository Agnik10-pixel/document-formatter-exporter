import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During development, any request to "/api/..." from the frontend
// is forwarded to the backend server on port 5000.
// This avoids CORS issues and keeps frontend code simple (just fetch("/api/...")).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
