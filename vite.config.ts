import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          core: ["react", "react-dom", "swr"], // This must be loaded immediately, FCP
          table: ["@tanstack/react-table"],
          icons: ["lucide-react"],
          toast: ["react-hot-toast"],
          modal: ["react-modal"],
          // state: ["zustand"], // Do not split: 0.65 kB │ gzip:  0.41 kB
          validation: ["yup"],
          // utils: ["body-scroll-lock"], // 3.04 kB │ gzip:  1.16 kB
        },
      },
    },
  },
});
