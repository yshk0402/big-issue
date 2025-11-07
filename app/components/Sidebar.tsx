'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../hooks/useTranslation';
import { Dispatch, SetStateAction } from 'react';

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ isSidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const { t, locale, setLocale } = useTranslation();

  const navItems = [
    { name: t('sidebar.home'), href: '/', icon: 'home' },
    { name: t('sidebar.proposals'), href: '/ideas', icon: 'groups' },
    { name: t('sidebar.bigIssue'), href: '/vote', icon: 'lightbulb' },
  ];

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}></div>
      )}

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-zinc-900 flex flex-col p-4 border-r border-slate-200 dark:border-zinc-800 shadow-lg md:shadow-sm transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static`}>
        <div className="flex items-center gap-3 p-2 mb-6">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="size-10 rounded-lg overflow-hidden bg-white flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="GOAT Logo"
              width={32}
              height={32}
              priority
              className="w-8 h-8 object-contain"
            />
          </Link>
        </div>
        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800'
                }`}>
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Language Switcher */}
        <div className="mt-auto p-2 flex justify-center">
          <div className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-zinc-800 p-1">
            <button
              onClick={() => setLocale('en')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                locale === 'en'
                  ? 'bg-white text-indigo-600 shadow dark:bg-zinc-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
              }`}>
              EN
            </button>
            <button
              onClick={() => setLocale('ja')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                locale === 'ja'
                  ? 'bg-white text-indigo-600 shadow dark:bg-zinc-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
              }`}>
              JA
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
