import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { storageGetRaw, storageSetRaw } from "../lib/storage";
import {
  dictionaries,
  LANGUAGE_STORAGE_KEY,
  translate,
  type Language,
  type TranslationKey,
} from "./translations";

type I18nValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

function readInitialLanguage(): Language {
  const stored = storageGetRaw(LANGUAGE_STORAGE_KEY);
  return stored && stored in dictionaries ? (stored as Language) : "ru";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    storageSetRaw(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const value = useMemo<I18nValue>(
    () => ({
      language,
      setLanguage,
      t: (key, params) => translate(language, key, params),
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
