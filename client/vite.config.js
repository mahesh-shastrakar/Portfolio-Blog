import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "https://portfolio-blog-backend-three.vercel.app",
      // rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
  plugins: [react()],
});
