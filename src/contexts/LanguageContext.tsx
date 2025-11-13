import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  STORAGE_KEYS,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from "../constants";

interface LanguageContextValue {
  language: string;
  setLanguage: (lang: string) => void;
  direction: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<string>(
    localStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE
  );
  const [direction, setDirection] = useState<"ltr" | "rtl">(
    language === SUPPORTED_LANGUAGES.ARABIC ? "rtl" : "ltr"
  );

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    i18n.changeLanguage(lang);
    setDirection(lang === SUPPORTED_LANGUAGES.ARABIC ? "rtl" : "ltr");
  };

  useEffect(() => {
    // Set initial direction based on language
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    direction,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
