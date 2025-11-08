'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { LanguageProvider } from './contexts/LanguageContext';
import { useTranslation } from './hooks/useTranslation';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';

const inter = Inter({ subsets: ['latin'] });

function AppMetadata() {
  const { t } = useTranslation();
  return (
    <head>
      <title>{t('GOAT App')}</title>
      <meta name="description" content={t('Idea Submission Platform')} />
    </head>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang={locale} className="light">
      <AppMetadata />
      <body
        className={`${inter.className} font-display bg-[#e8ebfb] dark:bg-zinc-900`}>
        <div className="relative min-h-screen md:flex">
          <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 flex flex-col">
            <MobileHeader toggleSidebar={() => setSidebarOpen(true)} />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AppLayout>{children}</AppLayout>
    </LanguageProvider>
  );
}
