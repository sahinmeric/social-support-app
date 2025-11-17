import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? "/social-support-app/" : "/",
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core libraries
          "react-vendor": ["react", "react-dom", "react/jsx-runtime"],
          // MUI components and styling
          "mui-vendor": [
            "@mui/material",
            "@mui/icons-material",
            "@mui/system",
            "@emotion/react",
            "@emotion/styled",
          ],
          // Form handling libraries
          "form-vendor": ["react-hook-form", "yup", "@hookform/resolvers"],
          // Internationalization libraries
          "i18n-vendor": ["i18next", "react-i18next"],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData",
        "**/*.test.{ts,tsx}",
      ],
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 75,
        statements: 75,
      },
    },
  },
});
