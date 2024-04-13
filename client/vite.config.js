import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://portfolio-blog-backend-three.vercel.app",
        secure: true,
      },
    },
  },
  plugins: [react()],
});
