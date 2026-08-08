import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocales } from 'expo-localization';

import { Language, localeTag, TranslationKey, translations } from './translations';

export type LanguagePreference = 'system' | Language;

const STORAGE_KEY = 'campaper.languagePreference';
const SUPPORTED_LANGUAGES: Language[] = ['id', 'en'];

function isSupportedLanguage(code: string | undefined | null): code is Language {
  return SUPPORTED_LANGUAGES.includes(code as Language);
}

type LanguageContextValue = {
  preference: LanguagePreference;
  language: Language;
  localeTag: string;
  setPreference: (preference: LanguagePreference) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<LanguagePreference>('system');
  const [hydrated, setHydrated] = useState(false);
  const deviceLocales = useLocales();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'id' || stored === 'en' || stored === 'system') {
        setPreferenceState(stored);
      }
      setHydrated(true);
    });
  }, []);

  function setPreference(next: LanguagePreference) {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }

  const deviceLanguage: Language = isSupportedLanguage(deviceLocales[0]?.languageCode)
    ? deviceLocales[0].languageCode
    : 'en';

  const language: Language = preference === 'system' ? deviceLanguage : preference;

  const t = useMemo(() => {
    return (key: TranslationKey, params?: Record<string, string | number>) => {
      let text: string = translations[language][key];
      if (params) {
        for (const [paramKey, value] of Object.entries(params)) {
          text = text.replace(`{${paramKey}}`, String(value));
        }
      }
      return text;
    };
  }, [language]);

  const value: LanguageContextValue = {
    preference,
    language,
    localeTag: localeTag[language],
    setPreference,
    t,
  };

  if (!hydrated) return null;

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
