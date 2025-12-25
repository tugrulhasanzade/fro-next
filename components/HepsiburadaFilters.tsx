import React from 'react';
import { FilterState } from '../types';
import { Search, ListFilter, Hash, Calendar, Filter } from 'lucide-react';

interface Props {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const HepsiburadaFilters: React.FC<Props> = ({ filters, setFilters }) => {
  // Light Mode: 
  // - Border: Orange-400 (Very visible)
  // - Background: Orange-50/50 (Tinted)
  // - Text: Black
  const inputClass = "w-full bg-orange-50/50 dark:bg-slate-950/50 border-2 border-orange-400 hover:border-red-500 focus:border-orange-600 dark:border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-slate-200 placeholder-orange-900/50 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all shadow-sm font-bold text-sm";
  const labelClass = "text-[11px] font-black text-orange-950 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1 block";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-orange-700 dark:text-slate-500 w-4 h-4";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      
      {/* Search */}
      <div className="space-y-4">
        <div>
           <label className={labelClass}>SKU Arama</label>
           <div className="relative">
             <Search className={iconClass} />
             <input
               type="text"
               placeholder="HB SKU veya Merchant SKU..."
               className={inputClass}
               value={filters.search}
               onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
             />
           </div>
        </div>
        <div>
           <label className={labelClass}>Ürün ID (Product ID)</label>
           <div className="relative">
             <Hash className={iconClass} />
             <input
               type="text"
               placeholder="Ürün ID..."
               className={inputClass}
             />
           </div>
        </div>
      </div>
      
      {/* Listing Status */}
      <div className="space-y-4">
        <div>
           <label className={labelClass}>Listeleme Durumu</label>
           <div className="relative">
             <ListFilter className={iconClass} />
             <select
               className={`${inputClass} appearance-none cursor-pointer`}
               value={filters.status}
               onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
             >
               <option value="">Tümü</option>
               <option value="salable-listings">Satışta Olanlar</option>
               <option value="notsalable-listings">Satışa Kapalı</option>
             </select>
           </div>
        </div>
        <div>
           <label className={labelClass}>Güncelleme Başlangıç</label>
           <div className="relative">
             <Calendar className={iconClass} />
             <input 
                type="date"
                className={inputClass}
             />
           </div>
        </div>
      </div>

      {/* Date Range End */}
      <div className="space-y-4">
         <div>
           <label className={labelClass}>Güncelleme Bitiş</label>
           <div className="relative">
             <Calendar className={iconClass} />
             <input 
                type="date"
                className={inputClass}
             />
           </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-end gap-3 pb-1">
         <button className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95 border border-orange-500/20">
            <Filter size={16} /> Listeyi Getir
         </button>
         <button className="w-full py-3 rounded-xl bg-orange-100 hover:bg-white dark:bg-white/5 border-2 border-orange-300 dark:border-white/10 text-orange-900 dark:text-slate-300 font-bold transition-all transform active:scale-95">
            Temizle
         </button>
      </div>
    </div>
  );
};