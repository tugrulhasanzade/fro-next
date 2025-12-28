'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ProductCard } from '@/components/ProductCard';
import { ProductManageModal } from '@/components/ProductManageModal';
import { Search, Filter, RefreshCw, Calendar, LayoutGrid, List, LayoutList } from 'lucide-react';
import type { Product, Platform } from '@/lib/types';
import { MOCK_TRENDYOL_PRODUCTS, MOCK_HEPSIBURADA_PRODUCTS } from '@/lib/mockData';

type ViewMode = 'grid' | 'list' | 'compact';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('trendyol');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Trendyol Filters
  const [trendyolSearch, setTrendyolSearch] = useState('');
  const [trendyolStatus, setTrendyolStatus] = useState('all');
  const [trendyolDateType, setTrendyolDateType] = useState<'created' | 'lastModified'>('created');

  // Hepsiburada Filters
  const [hepsiburadaSearch, setHepsiburadaSearch] = useState('');
  const [hepsiburadaListing, setHepsiburadaListing] = useState('all');

  // Theme Management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Get Products
  const allProducts = selectedPlatform === 'trendyol'
    ? MOCK_TRENDYOL_PRODUCTS
    : MOCK_HEPSIBURADA_PRODUCTS;

  // Filter Products
  const filteredProducts = allProducts.filter((product) => {
    if (selectedPlatform === 'trendyol' && product.platform === 'trendyol') {
      const searchLower = trendyolSearch.toLowerCase();
      const matchesSearch = !trendyolSearch ||
        product.barcode.includes(trendyolSearch) ||
        product.stockCode.toLowerCase().includes(searchLower) ||
        product.productMainId.toLowerCase().includes(searchLower) ||
        product.title.toLowerCase().includes(searchLower);

      const matchesStatus = trendyolStatus === 'all' ||
        (trendyolStatus === 'approved' && product.approved) ||
        (trendyolStatus === 'archived' && product.archived) ||
        (trendyolStatus === 'onSale' && product.onSale) ||
        (trendyolStatus === 'rejected' && product.rejected) ||
        (trendyolStatus === 'blacklisted' && product.blacklisted);

      return matchesSearch && matchesStatus;
    }

    if (selectedPlatform === 'hepsiburada' && product.platform === 'hepsiburada') {
      const searchLower = hepsiburadaSearch.toLowerCase();
      const matchesSearch = !hepsiburadaSearch ||
        product.hepsiburadaSku.toLowerCase().includes(searchLower) ||
        product.merchantSku.toLowerCase().includes(searchLower);

      const matchesListing = hepsiburadaListing === 'all' ||
        (hepsiburadaListing === 'salable' && product.listingStatus === 'active') ||
        (hepsiburadaListing === 'notsalable' && product.listingStatus === 'inactive');

      return matchesSearch && matchesListing;
    }

    return false;
  });

  const handleManageProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    console.log(`Refreshing ${selectedPlatform} products...`);
    // Backend API call buraya gelecek
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      {/* Header */}
      <Header theme={theme} onToggleTheme={toggleTheme} />

      {/* Sidebar */}
      <Sidebar
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        isModalOpen={isModalOpen}
      />

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-20 px-4 md:px-6 pl-4 md:pl-20 w-full min-h-screen">
        <div className="max-w-7xl mx-auto w-full">
          {/* Filters */}
          <div className="glass-card p-4 mb-6">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Ürün Kataloğu
              </h2>
              <div className="flex items-center space-x-2">
                {/* View Mode Toggles */}
                <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-lg p-1 border border-gray-200 dark:border-white/10">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    aria-label="Kart görünümü"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    aria-label="Liste görünümü"
                  >
                    <List size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('compact')}
                    className={`p-1.5 rounded transition-all ${viewMode === 'compact' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    aria-label="Kompakt görünüm"
                  >
                    <LayoutList size={18} />
                  </button>
                </div>

                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-all hover:scale-105 active:scale-95"
                >
                  <RefreshCw size={16} />
                  <span className="hidden sm:inline">Listeyi Yenile</span>
                </button>
              </div>
            </div>

            {selectedPlatform === 'trendyol' ? (
              // Trendyol Filters
              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Barkod, Stok Kodu, Ürün ID veya Ürün Adı ile ara..."
                    value={trendyolSearch}
                    onChange={(e) => setTrendyolSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-1.5">
                    <Filter size={16} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Filtrele:</span>
                  </div>

                  {/* Status Filter */}
                  <select
                    value={trendyolStatus}
                    onChange={(e) => setTrendyolStatus(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="all">Tüm Durumlar</option>
                    <option value="approved">Onaylandı</option>
                    <option value="archived">Arşiv</option>
                    <option value="onSale">Satışta</option>
                    <option value="rejected">Reddedildi</option>
                    <option value="blacklisted">Kara Liste</option>
                  </select>

                  {/* Date Type */}
                  <select
                    value={trendyolDateType}
                    onChange={(e) => setTrendyolDateType(e.target.value as 'created' | 'lastModified')}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="created">Oluşturma Tarihi</option>
                    <option value="lastModified">Güncelleme Tarihi</option>
                  </select>

                  {/* Date Range */}
                  <div className="flex items-center space-x-1.5">
                    <Calendar size={16} className="text-gray-400" />
                    <input
                      type="date"
                      className="px-2 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-gray-400 text-xs">-</span>
                    <input
                      type="date"
                      className="px-2 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Hepsiburada Filters
              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Hepsiburada SKU veya Satıcı SKU ile ara..."
                    value={hepsiburadaSearch}
                    onChange={(e) => setHepsiburadaSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-1.5">
                    <Filter size={16} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Filtrele:</span>
                  </div>

                  {/* Listing Status */}
                  <select
                    value={hepsiburadaListing}
                    onChange={(e) => setHepsiburadaListing(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="all">Tüm Ürünler</option>
                    <option value="salable">Satışta Olanlar</option>
                    <option value="notsalable">Satışta Olmayanlar</option>
                  </select>

                  {/* Date Range */}
                  <div className="flex items-center space-x-1.5">
                    <Calendar size={16} className="text-gray-400" />
                    <input
                      type="date"
                      className="px-2 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-gray-400 text-xs">-</span>
                    <input
                      type="date"
                      className="px-2 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-bold text-gray-900 dark:text-white">{filteredProducts.length}</span> ürün bulundu
              </span>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.barcode}
                    product={product}
                    onManage={handleManageProduct}
                  />
                ))}
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <ProductListItem
                    key={product.barcode}
                    product={product}
                    onManage={handleManageProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <ProductCompactItem
                    key={product.barcode}
                    product={product}
                    onManage={handleManageProduct}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-base text-gray-500 dark:text-gray-400">
                Aradığınız kriterlere uygun ürün bulunamadı
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Product Manage Modal */}
      {selectedProduct && (
        <ProductManageModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}

// List View Component
const ProductListItem: React.FC<{ product: Product; onManage: (product: Product) => void }> = ({ product, onManage }) => {
  const platformColor = product.platform === 'trendyol' ? 'from-orange-500 to-purple-600' : 'from-orange-500 to-red-600';
  const price = product.platform === 'trendyol' ? product.salePrice : product.price;
  const stock = product.platform === 'trendyol' ? product.quantity : product.availableStock;
  const image = product.platform === 'trendyol' ? (product.images?.[0]?.url || 'https://via.placeholder.com/200') : product.image;

  return (
    <div className="glass-card p-4 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center gap-4">
        {/* Image */}
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
          <img src={image} alt={product.title} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{product.title}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{product.barcode}</span>
                <div className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${platformColor} text-white text-[10px] font-bold uppercase`}>
                  {product.platform}
                </div>
              </div>
            </div>

            <button
              onClick={() => onManage(product)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Yönet
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">Fiyat:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">₺{price.toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">Stok:</span>
              <span className={`font-bold ${stock < 10 ? 'text-red-500' : stock < 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {stock}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">Güncelleme:</span>
              <span className="text-gray-600 dark:text-gray-300">{product.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact View Component
const ProductCompactItem: React.FC<{ product: Product; onManage: (product: Product) => void }> = ({ product, onManage }) => {
  const platformColor = product.platform === 'trendyol' ? 'from-orange-500 to-purple-600' : 'from-orange-500 to-red-600';
  const price = product.platform === 'trendyol' ? product.salePrice : product.price;
  const stock = product.platform === 'trendyol' ? product.quantity : product.availableStock;

  return (
    <div className="glass-card p-3 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-3">
        {/* Platform Badge */}
        <div className={`w-2 h-12 rounded-full bg-gradient-to-b ${platformColor} flex-shrink-0`} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 flex-1">{product.title}</h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">₺{price.toLocaleString('tr-TR')}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{product.barcode}</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${stock < 10 ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
                Stok: {stock}
              </span>
              <button
                onClick={() => onManage(product)}
                className="px-3 py-1 rounded-md bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-all"
              >
                Yönet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
