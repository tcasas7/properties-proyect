"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Locale = "es" | "en";

interface LocaleContextType {
  locale: Locale;
  switchLocale: () => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es");

  useEffect(() => {
    const storedLocale = localStorage.getItem("locale") as Locale | null;
    if (storedLocale === "es" || storedLocale === "en") {
      setLocale(storedLocale);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  const switchLocale = () => {
    setLocale((prev) => (prev === "es" ? "en" : "es"));
  };

  return (
    <LocaleContext.Provider value={{ locale, switchLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
