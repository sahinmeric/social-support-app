import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
});
