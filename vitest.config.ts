import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text"],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 80,
      },
      include: ["src/**/*.ts", "src/**/*.tsx"], // only your app source
      exclude: [
        "**/*.d.ts",
        "src/types/**",
        "src/**/types/**",
        "dist/**",
        "**/types.ts",
        "src/**/index.ts",
        "src/main.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
