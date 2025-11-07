'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'ja';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale) {
      setLocale(savedLocale);
    } else {
      // ブラウザの言語設定をデフォルトにする
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'ja') {
        setLocale('ja');
      }
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};
