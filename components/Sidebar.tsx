'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Package, MessageCircle, Gift, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import type { Platform } from '@/lib/types';

interface SidebarProps {
  selectedPlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
  isModalOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedPlatform, onPlatformChange, isModalOpen = false }) => {
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Menu Button - Only show when sidebar is closed and modal is not open */}
      {!isOpen && !isModalOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-[60] p-2 rounded-lg glass-card border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
          aria-label="Open menu"
        >
          <Menu size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 glass-card border-r border-gray-200 dark:border-white/10 flex flex-col z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo Section with Close Button */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <Logo />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            aria-label="Close menu"
          >
            <X size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {/* Platform Selection */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 block mb-1">Pazaryeri</span>

            <button
              onClick={() => onPlatformChange('trendyol')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${
                selectedPlatform === 'trendyol'
                  ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-gray-600 dark:text-gray-400 opacity-60 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <span className="text-lg">🛍️</span>
              <span className="text-sm font-semibold">Trendyol</span>
            </button>

            <button
              onClick={() => onPlatformChange('hepsiburada')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${
                selectedPlatform === 'hepsiburada'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                  : 'text-gray-600 dark:text-gray-400 opacity-60 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <span className="text-lg">🏪</span>
              <span className="text-sm font-semibold">Hepsiburada</span>
            </button>
          </div>

          {/* Marketplace Operations Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setIsMarketplaceOpen(!isMarketplaceOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <Package size={20} />
                <span className="text-sm font-semibold">Pazaryeri İşlemleri</span>
              </div>
              {isMarketplaceOpen ? (
                <ChevronDown size={16} className="transition-transform" />
              ) : (
                <ChevronRight size={16} className="transition-transform" />
              )}
            </button>

            {/* Dropdown Items */}
            {isMarketplaceOpen && (
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-indigo-200 dark:border-indigo-500/30 pl-4">
                <Link
                  href="/"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                >
                  <Package size={16} />
                  <span>Ürünler</span>
                </Link>

                <Link
                  href="https://partner.turkwise.com.tr/panel/customer-service"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                >
                  <MessageCircle size={16} />
                  <span>Müşteri Soruları</span>
                </Link>

                <Link
                  href="https://partner.turkwise.com.tr/panel/promotions"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                >
                  <Gift size={16} />
                  <span>Promosyon Yönetimi</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            © 2025 Turkwise
          </p>
        </div>
      </aside>
    </>
  );
};
