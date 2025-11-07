'use client';

import { useTranslation } from '../hooks/useTranslation';

interface MobileHeaderProps {
  toggleSidebar: () => void;
}

export default function MobileHeader({ toggleSidebar }: MobileHeaderProps) {
  const { locale, setLocale } = useTranslation();

  const getTitle = () => {
    return "GOAT";
  };

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-16 px-4">
      <button
        onClick={toggleSidebar}
        aria-label="Open sidebar"
        className="p-2 rounded-full text-gray-800 dark:text-gray-200"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>
      <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
        {getTitle()}
      </h1>
      
      {/* Language Switcher for Mobile */}
      <div className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-zinc-800 p-1">
        <button
          onClick={() => setLocale('en')}
          className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors ${
            locale === 'en'
              ? 'bg-white text-indigo-600 shadow dark:bg-zinc-700 dark:text-white'
              : 'text-gray-500'
          }`}>
          EN
        </button>
        <button
          onClick={() => setLocale('ja')}
          className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors ${
            locale === 'ja'
              ? 'bg-white text-indigo-600 shadow dark:bg-zinc-700 dark:text-white'
              : 'text-gray-500'
          }`}>
          JA
        </button>
      </div>
    </header>
  );
}
