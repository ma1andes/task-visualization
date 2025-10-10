import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Кастомизация - через dev-common
      "^/api/(edge|tag|block)-customization": {
        target: "https://drill.greact.ru",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api/dev-common"),
      },
      // Остальные API - напрямую
      "/api": {
        target: "https://drill.greact.ru",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
