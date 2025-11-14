import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/**
 * Dynamically load language resources
 * Only loads the requested language to reduce initial bundle size
 */
export const loadLanguageResources = async (language: string) => {
  try {
    let resources;
    switch (language) {
      case "ar":
        resources = await import("./ar.json");
        break;
      case "en":
      default:
        resources = await import("./en.json");
        break;
    }
    return resources.default;
  } catch (error) {
    console.error(`Failed to load language resources for ${language}:`, error);
    // Fallback to English if loading fails
    const fallback = await import("./en.json");
    return fallback.default;
  }
};

/**
 * Initialize i18next with dynamic language loading
 */
const initializeI18n = async () => {
  const savedLanguage = localStorage.getItem("language") || "en";

  // Load initial language resources
  const initialResources = await loadLanguageResources(savedLanguage);

  await i18n.use(initReactI18next).init({
    resources: {
      [savedLanguage]: {
        translation: initialResources,
      },
    },
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

  return i18n;
};

// Initialize i18n and export the promise
export const i18nInitPromise = initializeI18n();

export default i18n;
