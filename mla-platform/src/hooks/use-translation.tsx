"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/translations";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Load initial language from localStorage
    const savedLanguage = localStorage.getItem("app-language") as Language;
    if (savedLanguage === "en" || savedLanguage === "hi") {
      setLanguageState(savedLanguage);
    }
    
    // Listen for custom event trigger
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      if (customEvent.detail === "en" || customEvent.detail === "hi") {
        setLanguageState(customEvent.detail);
      }
    };
    
    window.addEventListener("app-language-change" as any, handleLangChange);
    return () => {
      window.removeEventListener("app-language-change" as any, handleLangChange);
    };
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
    // Dispatch a global event so that other components/pages react instantly
    window.dispatchEvent(new CustomEvent("app-language-change", { detail: lang }));
  };

  const t = (key: string): string => {
    if (!key) return "";
    
    const trimKey = key.trim();
    let current: any = translations[language];
    
    if (current && trimKey in current) {
      return current[trimKey];
    }
    
    // Fallback to English dictionary
    const enDict = translations["en"];
    if (enDict && trimKey in enDict) {
      return enDict[trimKey];
    }
    
    // Fallback to key itself
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Graceful fallback outside provider to avoid crashes
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: (key: string) => {
        if (!key) return "";
        const trimKey = key.trim();
        const enDict = translations["en"];
        if (enDict && trimKey in enDict) {
          return enDict[trimKey];
        }
        return key;
      }
    };
  }
  return context;
}
