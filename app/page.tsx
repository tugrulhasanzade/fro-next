
"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Box, Moon, Sun, Edit, RefreshCw, Layers, LayoutGrid, ChevronDown, Check, TrendingUp } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { TrendyolFilters } from '../components/TrendyolFilters';
import { HepsiburadaFilters } from '../components/HepsiburadaFilters';
import { EditModal } from '../components/EditModal';
import { Platform, FilterState, TrendyolProduct, HepsiburadaProduct } from '../types';
import { MOCK_TRENDYOL_PRODUCTS, MOCK_HEPSIBURADA_PRODUCTS } from '../constants';

// --- MOCK SPARKLINE COMPONENT ---
const Sparkline = ({ color = "emerald" }: { color?: "emerald" | "red" }) => {
  const strokeColor = color === "emerald" ? "#10b981" : "#ef4444";
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
      <path 
        d="M1 15L10 12L20 16L30 8L40 10L50 4L59 8" 
        stroke={strokeColor} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function Home() {
  const [platform, setPlatform] = useState<Platform>('trendyol');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    startDate: '',
    endDate: '',
    brand: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TrendyolProduct | HepsiburadaProduct | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleEdit = (product: TrendyolProduct | HepsiburadaProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // --- RENDER TABLES ---
  const renderTrendyolTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-white dark:text-slate-400 text-xs border-b-4 border-indigo-500 dark:border-white/10 uppercase tracking-wider bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-900 dark:from-transparent dark:to-transparent shadow-md">
            <th className="p-5 font-black text-white dark:text-slate-300">Ürün Detayı</th>
            <th className="p-5 font-black text-white dark:text-slate-300">Barkod / Marka</th>
            <th className="p-5 font-black text-right text-white dark:text-slate-300">Fiyat & Trend</th>
            <th className="p-5 font-black text-center text-white dark:text-slate-300">Stok</th>
            <th className="p-5 font-black text-white dark:text-slate-300">Durum</th>
            <th className="p-5 font-black text-right text-white dark:text-slate-300">İşlemler</th>
          </tr>
        </thead>
        <tbody className="text-slate-950 dark:text-slate-200 text-sm bg-white dark:bg-transparent">
          {MOCK_TRENDYOL_PRODUCTS.map((product) => (
            <tr key={product.id} className="glass-shine-hover border-b-2 border-indigo-100 dark:border-white/5 hover:bg-indigo-50 dark:hover:bg-white/5 transition-all duration-300 group hover:scale-[1.005] hover:shadow-lg hover:z-10 relative">
              <td className="p-5">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-16 bg-white dark:bg-white/10 rounded-lg overflow-hidden shadow-lg border-2 border-indigo-200 dark:border-transparent relative transition-transform duration-300 group-hover:scale-110">
                     <img src={product.images[0]?.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-extrabold text-black dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 max-w-[200px]">{product.title}</div>
                    <div className="text-white dark:text-slate-400 text-[10px] mt-1.5 font-bold bg-indigo-600 dark:bg-white/5 px-2 py-0.5 rounded w-fit shadow-sm">{product.categoryName}</div>
                  </div>
                </div>
              </td>
              <td className="p-5">
                <div className="font-mono text-xs text-indigo-900 dark:text-slate-400 flex items-center gap-1 font-bold"><Layers size={10}/> {product.barcode}</div>
                <div className="text-black dark:text-slate-300 font-black mt-1 text-xs">{product.brandName}</div>
                <div className="text-slate-600 dark:text-slate-500 text-[10px] mt-0.5 font-bold">{product.stockCode}</div>
              </td>
              <td className="p-5 text-right">
                 <div className="flex flex-col items-end gap-1">
                    <div className="text-indigo-900 dark:text-indigo-400 font-black text-lg">{product.salePrice} <span className="text-[10px] text-slate-500 dark:text-slate-400">{product.currencyType}</span></div>
                    <div className="flex items-center gap-2">
                         <Sparkline color={product.salePrice > 500 ? "red" : "emerald"} />
                         <div className="text-slate-500 dark:text-slate-500 text-xs line-through decoration-red-500/50 font-bold">{product.listPrice}</div>
                    </div>
                 </div>
              </td>
              <td className="p-5 text-center">
                 <span className={`px-3 py-1.5 rounded-lg text-xs font-black shadow-md border-2 transition-transform hover:scale-110 inline-block ${product.quantity < 10 ? 'bg-red-50 border-red-200 text-red-700 dark:border-transparent dark:bg-red-500/20 dark:text-red-300 shadow-red-500/20' : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:border-transparent dark:bg-green-500/20 dark:text-green-300 shadow-green-500/20'}`}>
                    {product.quantity}
                 </span>
              </td>
              <td className="p-5">
                 <div className="flex flex-col gap-1.5 items-start">
                    <StatusBadge 
                      status={product.approved ? 'success' : 'warning'} 
                      text={product.approved ? 'Onaylandı' : 'Beklemede'} 
                    />
                    {product.rejected && <StatusBadge status="error" text="Reddedildi" />}
                 </div>
              </td>
              <td className="p-5 text-right">
                <button 
                  onClick={() => handleEdit(product)}
                  className="group/btn relative px-4 py-2 rounded-xl bg-indigo-50 dark:bg-white/5 border-2 border-indigo-200 dark:border-white/10 hover:border-indigo-600 dark:hover:border-indigo-400 text-indigo-900 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500/20 dark:hover:text-indigo-300 transition-all flex items-center gap-2 ml-auto shadow-sm font-bold hover:scale-105 active:scale-95"
                >
                  <Edit size={14} />
                  <span className="text-xs">Yönet</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderHepsiburadaTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-white dark:text-slate-400 text-xs border-b-4 border-orange-500 dark:border-white/10 uppercase tracking-wider bg-gradient-to-r from-orange-800 via-red-700 to-orange-800 dark:from-transparent dark:to-transparent shadow-md">
             <th className="p-5 font-black text-white dark:text-slate-300">Ürün</th>
             <th className="p-5 font-black text-white dark:text-slate-300">SKU Bilgileri</th>
             <th className="p-5 font-black text-right text-white dark:text-slate-300">Fiyat & Trend</th>
             <th className="p-5 font-black text-center text-white dark:text-slate-300">Stok</th>
             <th className="p-5 font-black text-white dark:text-slate-300">Entegrasyon</th>
             <th className="p-5 font-black text-right text-white dark:text-slate-300">İşlemler</th>
          </tr>
        </thead>
        <tbody className="text-slate-950 dark:text-slate-200 text-sm bg-white dark:bg-transparent">
          {MOCK_HEPSIBURADA_PRODUCTS.map((product) => (
            <tr key={product.id} className="glass-shine-hover border-b-2 border-orange-100 dark:border-white/5 hover:bg-orange-50 dark:hover:bg-white/5 transition-all duration-300 group hover:scale-[1.005] hover:shadow-lg hover:z-10 relative">
              <td className="p-5">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-16 bg-white dark:bg-white/10 rounded-lg overflow-hidden shadow-lg border-2 border-orange-200 dark:border-transparent transition-transform duration-300 group-hover:scale-110">
                       <img src={product.images[0] || 'https://via.placeholder.com/50'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <div className="font-extrabold text-black dark:text-white group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors">{product.urunAdi}</div>
                       <div className="text-orange-900 dark:text-slate-400 text-xs mt-1 font-bold">{product.marka}</div>
                    </div>
                 </div>
              </td>
              <td className="p-5 font-mono text-xs space-y-1">
                 <div className="text-white dark:text-orange-400 bg-orange-600 dark:bg-orange-900/20 px-2 py-0.5 rounded w-fit shadow-sm font-bold">HB: {product.hepsiburadaSku}</div>
                 <div className="text-slate-800 font-bold">M: {product.merchantSku}</div>
              </td>
              <td className="p-5 text-right">
                 <div className="flex flex-col items-end gap-1">
                    <div className="font-black text-black dark:text-white text-lg">{product.price} TL</div>
                    <Sparkline color={product.price > 500 ? "red" : "emerald"} />
                 </div>
              </td>
              <td className="p-5 text-center">
                 <span className={`px-3 py-1.5 rounded-lg text-xs font-black shadow-md border-2 transition-transform hover:scale-110 inline-block ${product.availableStock === 0 ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/20 dark:text-red-300 dark:border-transparent shadow-red-500/20' : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-green-500/20 dark:text-green-300 dark:border-transparent shadow-green-500/20'}`}>
                    {product.availableStock}
                 </span>
              </td>
              <td className="p-5">
                 <div className="flex flex-col gap-1">
                    <StatusBadge 
                        status={product.uploadStatus === 'Success' ? 'success' : product.uploadStatus === 'Error' ? 'error' : 'warning'} 
                        text={product.uploadStatus || 'Bilinmiyor'} 
                    />
                    {product.errorMessage && (
                        <span className="text-[10px] text-red-900 dark:text-red-400 max-w-[140px] truncate font-bold bg-red-100 dark:bg-red-500/10 px-2 py-1 rounded border border-red-200 dark:border-transparent">{product.errorMessage}</span>
                    )}
                 </div>
              </td>
              <td className="p-5 text-right">
                <button 
                   onClick={() => handleEdit(product)}
                   className="group/btn relative px-4 py-2 rounded-xl bg-orange-50 dark:bg-white/5 border-2 border-orange-200 dark:border-white/10 hover:border-orange-600 dark:hover:border-orange-400 text-orange-900 dark:text-slate-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:text-orange-800 dark:hover:text-orange-300 transition-all flex items-center gap-2 ml-auto shadow-sm font-bold hover:scale-105 active:scale-95"
                >
                   <Edit size={14} />
                   <span className="text-xs">Yönet</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-black transition-colors duration-500 font-sans selection:bg-indigo-500/30 pb-24">
      
      {/* --- DYNAMIC PARALLAX BACKGROUNDS --- */}
      <div className={`fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 via-[#050510] to-black -z-20 transition-opacity duration-700 pointer-events-none ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className={`fixed inset-0 bg-indigo-50/40 -z-20 transition-opacity duration-1000 pointer-events-none ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}>
          {/* Blobs move slightly based on mouse position */}
          <div 
             className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-300/40 blur-[100px] animate-pulse transition-transform duration-100 ease-out" 
             style={{ transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)` }}
          />
          <div 
             className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-300/40 blur-[120px] transition-transform duration-100 ease-out" 
             style={{ transform: `translate(${-mousePos.x * 0.02}px, ${-mousePos.y * 0.02}px)` }}
          />
          <div 
             className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-emerald-200/50 blur-[90px] transition-transform duration-100 ease-out" 
             style={{ transform: `translate(${mousePos.x * 0.01}px, ${-mousePos.y * 0.01}px)` }}
          />
      </div>

      {/* --- TOP HEADER (Simplified) --- */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 transition-all">
         
         {/* Left Side: Logo */}
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white font-black text-xl hover:scale-105 transition-transform">
               M
            </div>
            <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight hidden md:block">
               MarketGlass
            </span>
         </div>

         {/* Right Side: Actions */}
         <div className="flex items-center gap-2">
             <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-white hover:text-indigo-600 dark:hover:bg-white/10 dark:hover:text-indigo-400 hover:shadow-sm transition-all hover:scale-105 active:scale-95" title="Listeyi Yenile">
               <RefreshCw size={18} />
             </button>
             <button 
               onClick={toggleTheme}
               className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-white hover:text-indigo-600 dark:hover:bg-white/10 dark:hover:text-indigo-400 hover:shadow-sm transition-all hover:scale-105 active:scale-95"
             >
               {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
             </button>
         </div>
      </header>

      {/* --- FLOATING PLATFORM SWITCHER (BOTTOM CENTER) --- */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center p-1.5 gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-full shadow-2xl shadow-indigo-500/20 dark:shadow-black/50 transition-all hover:scale-105 duration-300">
         <button 
           onClick={() => setPlatform('trendyol')}
           className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              platform === 'trendyol'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
           }`}
         >
           <ShoppingBag size={18} />
           <span>Trendyol</span>
         </button>

         <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1"></div>

         <button 
           onClick={() => setPlatform('hepsiburada')}
           className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              platform === 'hepsiburada'
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30 scale-105'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
           }`}
         >
           <Box size={18} />
           <span>Hepsiburada</span>
         </button>
      </div>

      {/* --- MAIN LAYOUT --- */}
      <main className="relative z-10 w-full pt-28 px-4 md:px-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Context Header */}
            <div className="flex flex-col md:flex-row justify-between items-end pb-2 border-b-2 border-slate-200 dark:border-white/10 pb-4 gap-4">
               <div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-3">
                     {platform === 'trendyol' ? 'Trendyol' : 'Hepsiburada'}
                     <span className="text-2xl md:text-4xl font-light text-slate-400">Mağaza</span>
                  </h2>
                  <p className="text-slate-950 dark:text-slate-400 font-bold mt-2 text-sm md:text-base">
                     {platform === 'trendyol' ? 'Ürün onay süreçlerini, fiyatları ve batch işlemlerini yönetin.' : 'Katalog eşleşmeleri ve envanter durumlarını kontrol edin.'}
                  </p>
               </div>
            </div>

            {/* Filters Area */}
            <GlassCard className="p-6">
               {platform === 'trendyol' 
                  ? <TrendyolFilters filters={filters} setFilters={setFilters} /> 
                  : <HepsiburadaFilters filters={filters} setFilters={setFilters} />
               }
            </GlassCard>

            {/* Data Table */}
            <GlassCard hoverEffect={false} className="overflow-hidden min-h-[500px]">
               {platform === 'trendyol' ? renderTrendyolTable() : renderHepsiburadaTable()}
            </GlassCard>

      </main>

      {/* Edit Modal */}
      <EditModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         product={selectedProduct} 
         platform={platform} 
      />

    </div>
  );
}
