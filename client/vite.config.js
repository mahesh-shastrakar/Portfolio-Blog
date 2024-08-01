import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "dotenv/config";

// https://vitejs.dev/config/
export default defineConfig({
  // the server proxy is used to redirect the requests to the backend server when the client makes a request to the /api endpoint
  // server: {
  //   proxy: {
  // "/api": "process.env.BACKEND_URL",
  //     // "/api": "http://localhost:3000",
  //   },
  // },
  plugins: [react()],
});
