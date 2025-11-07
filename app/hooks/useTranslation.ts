'use client';

import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import en from '../locales/en.json';
import ja from '../locales/ja.json';

const translations = {
  en: en as { [key: string]: string },
  ja: ja as { [key: string]: string },
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  const { locale, setLocale } = context;

  const t = (key: string) => {
    return translations[locale][key] || key;
  };

  return { t, locale, setLocale };
};
