import React, { useState, useEffect } from 'react';
import { ShoppingBag, Box, Moon, Sun, Edit, RefreshCw, Layers } from 'lucide-react';
import { GlassCard } from './components/GlassCard';
import { StatusBadge } from './components/StatusBadge';
import { TrendyolFilters } from './components/TrendyolFilters';
import { HepsiburadaFilters } from './components/HepsiburadaFilters';
import { EditModal } from './components/EditModal';
import { Platform, FilterState, TrendyolProduct, HepsiburadaProduct } from './types';
import { MOCK_TRENDYOL_PRODUCTS, MOCK_HEPSIBURADA_PRODUCTS } from './constants';

const App: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>('trendyol');
  // CHANGED: Default is now 'light' to show changes immediately
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
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
          {/* COLORFUL HEADER: Stronger Gradient for visibility */}
          <tr className="text-black dark:text-slate-400 text-xs border-b-2 border-indigo-300 dark:border-white/10 uppercase tracking-wider bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 dark:from-transparent dark:to-transparent">
            <th className="p-5 font-black text-indigo-950 dark:text-slate-300">Ürün Detayı</th>
            <th className="p-5 font-black text-indigo-950 dark:text-slate-300">Barkod / Marka</th>
            <th className="p-5 font-black text-right text-indigo-950 dark:text-slate-300">Fiyat</th>
            <th className="p-5 font-black text-center text-indigo-950 dark:text-slate-300">Stok</th>
            <th className="p-5 font-black text-indigo-950 dark:text-slate-300">Durum</th>
            <th className="p-5 font-black text-right text-indigo-950 dark:text-slate-300">İşlemler</th>
          </tr>
        </thead>
        <tbody className="text-slate-950 dark:text-slate-200 text-sm">
          {MOCK_TRENDYOL_PRODUCTS.map((product) => (
            <tr key={product.id} className="border-b border-indigo-200 dark:border-white/5 hover:bg-indigo-100/50 dark:hover:bg-white/5 transition-colors group">
              <td className="p-5">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-16 bg-white dark:bg-white/10 rounded-lg overflow-hidden shadow-md border-2 border-indigo-100 dark:border-transparent relative">
                     <img src={product.images[0]?.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    {/* Ürün Başlığı: Simsiyah */}
                    <div className="font-extrabold text-black dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 max-w-[200px]">{product.title}</div>
                    {/* Kategori: Renkli Badge */}
                    <div className="text-indigo-900 dark:text-slate-400 text-[11px] mt-1 font-black bg-indigo-200/60 dark:bg-white/5 px-2 py-0.5 rounded w-fit border border-indigo-300 dark:border-transparent">{product.categoryName}</div>
                  </div>
                </div>
              </td>
              <td className="p-5">
                {/* Barkod */}
                <div className="font-mono text-xs text-indigo-900 dark:text-slate-400 flex items-center gap-1 font-bold"><Layers size={10}/> {product.barcode}</div>
                {/* Marka */}
                <div className="text-black dark:text-slate-300 font-black mt-1 text-xs">{product.brandName}</div>
                {/* Stok Kodu */}
                <div className="text-slate-700 dark:text-slate-500 text-[10px] mt-0.5 font-bold">{product.stockCode}</div>
              </td>
              <td className="p-5 text-right">
                 <div className="text-indigo-950 dark:text-indigo-400 font-black text-lg">{product.salePrice} <span className="text-[10px] text-slate-700 dark:text-slate-400">{product.currencyType}</span></div>
                 <div className="text-slate-600 dark:text-slate-500 text-xs line-through decoration-red-500/50 font-bold">{product.listPrice}</div>
              </td>
              <td className="p-5 text-center">
                 {/* Stok Badge */}
                 <span className={`px-3 py-1.5 rounded-lg text-xs font-black shadow-sm border ${product.quantity < 10 ? 'bg-red-100 text-red-900 border-red-200 dark:border-transparent dark:bg-red-500/20 dark:text-red-300' : 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:border-transparent dark:bg-green-500/20 dark:text-green-300'}`}>
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
                  className="group relative px-4 py-2 rounded-xl bg-white dark:bg-white/5 border-2 border-indigo-300 dark:border-white/10 hover:border-indigo-600 dark:hover:border-indigo-400 text-indigo-900 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all flex items-center gap-2 ml-auto shadow-sm font-bold"
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
          {/* COLORFUL HEADER: Stronger Orange/Red Gradient */}
          <tr className="text-black dark:text-slate-400 text-xs border-b-2 border-orange-300 dark:border-white/10 uppercase tracking-wider bg-gradient-to-r from-orange-200 via-red-200 to-orange-200 dark:from-transparent dark:to-transparent">
             <th className="p-5 font-black text-orange-950 dark:text-slate-300">Ürün</th>
             <th className="p-5 font-black text-orange-950 dark:text-slate-300">SKU Bilgileri</th>
             <th className="p-5 font-black text-right text-orange-950 dark:text-slate-300">Fiyat</th>
             <th className="p-5 font-black text-center text-orange-950 dark:text-slate-300">Stok</th>
             <th className="p-5 font-black text-orange-950 dark:text-slate-300">Entegrasyon</th>
             <th className="p-5 font-black text-right text-orange-950 dark:text-slate-300">İşlemler</th>
          </tr>
        </thead>
        <tbody className="text-slate-950 dark:text-slate-200 text-sm">
          {MOCK_HEPSIBURADA_PRODUCTS.map((product) => (
            <tr key={product.id} className="border-b border-orange-200 dark:border-white/5 hover:bg-orange-100/50 dark:hover:bg-white/5 transition-colors group">
              <td className="p-5">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-16 bg-white dark:bg-white/10 rounded-lg overflow-hidden shadow-md border-2 border-orange-100 dark:border-transparent">
                       <img src={product.images[0] || 'https://via.placeholder.com/50'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <div className="font-extrabold text-black dark:text-white group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors">{product.urunAdi}</div>
                       <div className="text-orange-900 dark:text-slate-400 text-xs mt-1 font-bold">{product.marka}</div>
                    </div>
                 </div>
              </td>
              <td className="p-5 font-mono text-xs space-y-1">
                 <div className="text-orange-900 dark:text-orange-400 bg-orange-200/60 dark:bg-orange-900/20 px-2 py-0.5 rounded w-fit border border-orange-300 dark:border-transparent font-black">HB: {product.hepsiburadaSku}</div>
                 <div className="text-slate-800 font-bold">M: {product.merchantSku}</div>
              </td>
              <td className="p-5 text-right">
                 <div className="font-black text-black dark:text-white text-lg">{product.price} TL</div>
              </td>
              <td className="p-5 text-center">
                 <span className={`px-3 py-1.5 rounded-lg text-xs font-black shadow-sm border ${product.availableStock === 0 ? 'bg-red-100 text-red-900 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-transparent' : 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-green-500/20 dark:text-green-300 dark:border-transparent'}`}>
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
                   className="group relative px-4 py-2 rounded-xl bg-white dark:bg-white/5 border-2 border-orange-300 dark:border-white/10 hover:border-orange-600 dark:hover:border-orange-400 text-orange-900 dark:text-slate-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:text-orange-800 dark:hover:text-orange-300 transition-all flex items-center gap-2 ml-auto shadow-sm font-bold"
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
    <div className="relative w-full h-screen overflow-hidden text-slate-900 dark:text-white antialiased transition-colors duration-500 selection:bg-indigo-500/30 font-sans">
      
      {/* --- DYNAMIC BACKGROUNDS --- */}
      
      {/* Dark Mode Background */}
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 via-[#050510] to-black -z-20 transition-opacity duration-700 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Light Mode: 
          CHANGED: Used bg-indigo-50/30 base to remove the 'stark white' feel.
          Enhanced the blobs to be more vibrant.
      */}
      <div className={`absolute inset-0 bg-indigo-50/40 -z-20 transition-opacity duration-1000 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-300/40 blur-[100px] animate-pulse" style={{animationDuration: '8s'}} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-300/40 blur-[120px]" />
          <div className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-emerald-200/50 blur-[90px]" />
      </div>

      {/* --- HEADER & PLATFORM SWITCHER (Top Center) --- */}
      <header className="absolute top-0 left-0 w-full z-40 px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
         
         {/* Title Area */}
         <div className="hidden md:block">
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-slate-800 dark:from-white dark:to-slate-400">
               Panel<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
            </h1>
         </div>

         {/* Center: Glass Segmented Control with Colored Active States */}
         <div className="p-1.5 bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl border border-indigo-200 dark:border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex relative overflow-hidden">
             <button 
               onClick={() => setPlatform('trendyol')}
               className={`relative z-10 flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  platform === 'trendyol'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-800 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-white/5'
               }`}
             >
               <ShoppingBag size={16} />
               <span>Trendyol</span>
             </button>
             <button 
               onClick={() => setPlatform('hepsiburada')}
               className={`relative z-10 flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  platform === 'hepsiburada'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-slate-800 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-white/5'
               }`}
             >
               <Box size={16} />
               <span>Hepsiburada</span>
             </button>
         </div>

         {/* Right: Theme Toggle & Actions */}
         <div className="flex items-center gap-3">
             <button className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/40 border border-indigo-200 dark:border-white/10 text-indigo-900 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors shadow-sm" title="Listeyi Yenile">
               <RefreshCw size={20} />
             </button>
             <button 
               onClick={toggleTheme}
               className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/40 border border-indigo-200 dark:border-white/10 text-indigo-900 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
             >
               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
         </div>

      </header>


      {/* --- MAIN LAYOUT --- */}
      <main className="relative z-10 h-full overflow-y-auto custom-scrollbar pt-28 pb-10 px-4 md:px-8">
         <div className="max-w-[1500px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Context Header */}
            <div className="flex justify-between items-end pb-2">
               <div>
                  <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight flex items-center gap-3">
                     {platform === 'trendyol' ? 'Trendyol Mağaza' : 'Hepsiburada Entegrasyon'}
                     <span className={`text-xs font-bold px-2 py-1 rounded-md border-2 shadow-sm ${platform === 'trendyol' ? 'bg-indigo-100 text-indigo-900 border-indigo-200' : 'bg-orange-100 text-orange-900 border-orange-200'} dark:bg-white/10 dark:text-slate-400 dark:border-white/20`}>
                        {platform === 'trendyol' ? 'v2.0 API' : 'Merchant API'}
                     </span>
                  </h2>
                  <p className="text-slate-800 dark:text-slate-400 font-bold mt-1">
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

         </div>
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
};

export default App;