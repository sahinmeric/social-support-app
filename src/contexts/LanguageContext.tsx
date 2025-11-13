import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

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
    localStorage.getItem("language") || "en"
  );
  const [direction, setDirection] = useState<"ltr" | "rtl">(
    language === "ar" ? "rtl" : "ltr"
  );

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
    setDirection(lang === "ar" ? "rtl" : "ltr");
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
