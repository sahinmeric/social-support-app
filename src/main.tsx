import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { i18nInitPromise } from "./i18n/config";
import App from "./App.tsx";
import { LanguageProvider } from "./contexts/LanguageContext";

// Wait for i18n to initialize before rendering the app
i18nInitPromise.then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StrictMode>
  );
});
