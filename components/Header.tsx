'use client';

import React from 'react';
import Link from 'next/link';
import { Moon, Sun, User } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-card border-b border-gray-200 dark:border-white/10">
      <div className="w-full px-4 md:px-6 ml-0 md:ml-20">
        <div className="flex items-center justify-between h-16">
          {/* Left: Title */}
          <div className="flex-1 min-w-0 mr-2 ml-12 md:ml-0">
            <h1 className="text-base md:text-xl font-display font-bold text-gray-900 dark:text-white truncate">
              Ürün Yönetimi
            </h1>
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Pazaryeri ürünlerinizi yönetin
            </p>
          </div>

          {/* Right: Theme Toggle & Profile */}
          <div className="flex items-center space-x-2 md:space-x-3 mr-[100px]">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 md:p-2.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10
                       text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400
                       hover:bg-white dark:hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} className="md:w-5 md:h-5" /> : <Moon size={18} className="md:w-5 md:h-5" />}
            </button>

            {/* Profile Button */}
            <Link
              href="https://partner.turkwise.com.tr/panel/profile"
              className="flex items-center space-x-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10
                       text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400
                       hover:bg-white dark:hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <User size={18} className="md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-semibold hidden sm:inline">Profil</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
