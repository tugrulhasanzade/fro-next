
import React from 'react';
import { FilterState } from '../types';
import { Search, Calendar, Filter, Tag, Clock } from 'lucide-react';

interface Props {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const TrendyolFilters: React.FC<Props> = ({ filters, setFilters }) => {
  // Updated inputClass: placeholder-slate-500 for better visibility in light mode
  const inputClass = "w-full bg-white dark:bg-slate-950/50 border-2 border-indigo-200 hover:border-indigo-400 focus:border-indigo-600 dark:border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-slate-950 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all shadow-sm font-bold text-sm";
  const labelClass = "text-[11px] font-black text-indigo-900 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1 block";
  
  // Icon color matches the button gradient
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 dark:text-slate-500 w-4 h-4";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      
      {/* Search & Brand */}
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Arama (Barkod/Stok Kodu)</label>
          <div className="relative group">
            <Search className={iconClass} />
            <input
              type="text"
              placeholder="Arama yap..."
              className={inputClass}
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
        </div>
        <div>
           <label className={labelClass}>Marka (ID veya İsim)</label>
           <div className="relative">
             <Tag className={iconClass} />
             <input
              type="text"
              placeholder="Marka ID'leri..."
              className={inputClass}
              value={filters.brand}
              onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
            />
           </div>
        </div>
      </div>
      
      {/* Status & Date Type */}
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Ürün Durumu</label>
          <div className="relative">
            <Filter className={iconClass} />
            <select
              className={`${inputClass} appearance-none cursor-pointer text-slate-900 dark:text-slate-200`}
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">Tüm Durumlar</option>
              <option value="approved">Onaylanan</option>
              <option value="onSale">Satışta</option>
              <option value="rejected">Reddedilen</option>
              <option value="blacklisted">Karaliste</option>
              <option value="archived">Arşivlenen</option>
            </select>
          </div>
        </div>
        <div>
           <label className={labelClass}>Tarih Tipi</label>
           <div className="relative">
             <Clock className={iconClass} />
             <select 
               className={`${inputClass} appearance-none cursor-pointer text-slate-900 dark:text-slate-200`}
               value={filters.dateQueryType || 'lastModified'}
               onChange={(e) => setFilters(prev => ({ ...prev, dateQueryType: e.target.value as any }))}
             >
                <option value="lastModified">Son Güncelleme</option>
                <option value="created">Oluşturulma</option>
             </select>
           </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-4">
        <div>
           <label className={labelClass}>Başlangıç Tarihi</label>
           <div className="relative">
             <Calendar className={iconClass} />
             <input 
                type="date"
                className={inputClass}
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
             />
           </div>
        </div>
        <div>
           <label className={labelClass}>Bitiş Tarihi</label>
           <div className="relative">
             <Calendar className={iconClass} />
             <input 
                type="date"
                className={inputClass}
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
             />
           </div>
        </div>
      </div>

      {/* Action Buttons (Filter & Reset) */}
      <div className="flex flex-col justify-end gap-3 pb-1">
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95 border border-indigo-500/20">
             <Filter size={16} /> Filtrele (Yenile)
          </button>
          <button className="w-full py-3 rounded-xl bg-white hover:bg-indigo-50 dark:bg-white/5 border-2 border-indigo-200 dark:border-white/10 text-indigo-900 dark:text-slate-300 font-bold transition-all transform active:scale-95">
             Temizle
          </button>
      </div>

    </div>
  );
};
