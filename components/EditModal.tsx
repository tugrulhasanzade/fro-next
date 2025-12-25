import React, { useState } from 'react';
import { X, Save, Box, Tag, Image as ImageIcon, Truck, Activity, Video, Layers } from 'lucide-react';
import { TrendyolProduct, HepsiburadaProduct, Platform } from '../types';
import { GlassCard } from './GlassCard';
import { StatusBadge } from './StatusBadge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: TrendyolProduct | HepsiburadaProduct | null;
  platform: Platform;
}

export const EditModal: React.FC<Props> = ({ isOpen, onClose, product, platform }) => {
  const [activeTab, setActiveTab] = useState('general');

  if (!isOpen || !product) return null;

  // Type Guards
  const isTrendyol = (p: any): p is TrendyolProduct => platform === 'trendyol';
  const isHepsiburada = (p: any): p is HepsiburadaProduct => platform === 'hepsiburada';

  const tabClass = (id: string) => `
    flex items-center space-x-2 py-4 px-4 text-sm font-medium border-b-2 transition-all duration-300
    ${activeTab === id 
      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
      : 'border-transparent text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
    }
  `;

  // Fix Contrast: Pure white background for light mode inputs, darker border
  const inputLabelClass = "text-xs font-black text-slate-800 dark:text-slate-400 uppercase tracking-wider mb-2 block";
  const inputClass = "w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700/50 rounded-xl p-3 text-slate-950 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm font-semibold";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <GlassCard className="w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden !rounded-[32px] border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center bg-slate-100/90 dark:bg-slate-800/30">
          <div>
             <h2 className="text-2xl font-black text-slate-950 dark:text-white mb-1">
                {isTrendyol(product) ? product.title : isHepsiburada(product) ? product.urunAdi : 'Ürün Düzenle'}
             </h2>
             <div className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-400">
                <span className="font-mono bg-white border border-slate-300 dark:border-transparent dark:bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-900 dark:text-slate-300 font-bold">
                    {isTrendyol(product) ? product.barcode : product.hepsiburadaSku}
                </span>
                <span className="w-1.5 h-1.5 bg-slate-500 dark:bg-slate-600 rounded-full"></span>
                <span className="uppercase tracking-wide text-xs font-bold text-indigo-700 dark:text-indigo-400">
                    {platform}
                </span>
             </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700/50 px-6 space-x-2 bg-slate-50/80 dark:bg-slate-800/20 overflow-x-auto">
          {[
            { id: 'general', label: 'Genel Bilgiler', icon: Box },
            { id: 'price-stock', label: 'Fiyat & Stok', icon: Tag },
            { id: 'images', label: 'Medya', icon: ImageIcon },
            { id: 'delivery', label: 'Lojistik', icon: Truck },
            platform === 'trendyol' ? { id: 'status', label: 'Durum & Batch', icon: Activity } : { id: 'status', label: 'Entegrasyon', icon: Activity },
            platform === 'hepsiburada' ? { id: 'variants', label: 'Varyantlar', icon: Layers } : null
          ].filter(Boolean).map((tab: any) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={tabClass(tab.id)}
             >
                <tab.icon size={16} />
                <span>{tab.label}</span>
             </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/90 dark:bg-slate-900/30 custom-scrollbar">
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div className="space-y-1">
                      <label className={inputLabelClass}>Ürün Başlığı</label>
                      <input type="text" defaultValue={isTrendyol(product) ? product.title : isHepsiburada(product) ? product.urunAdi : ''} className={inputClass} />
                   </div>
                   <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1">
                         <label className={inputLabelClass}>Barkod</label>
                         <input type="text" readOnly defaultValue={product.barcode || ''} className={`${inputClass} opacity-80 bg-slate-100 dark:bg-slate-900 cursor-not-allowed`} />
                      </div>
                      <div className="space-y-1">
                         <label className={inputLabelClass}>Marka</label>
                         <input type="text" defaultValue={isTrendyol(product) ? product.brandName : isHepsiburada(product) ? product.marka : ''} className={inputClass} />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className={inputLabelClass}>Kategori ID</label>
                      <input type="text" defaultValue={isTrendyol(product) ? product.categoryId : isHepsiburada(product) ? product.categoryId : ''} className={inputClass} />
                   </div>
                   {isHepsiburada(product) && (
                       <div className="space-y-1">
                           <label className={inputLabelClass}>Garanti Süresi (Ay)</label>
                           <input type="number" defaultValue={product.garantiSuresi} className={inputClass} />
                       </div>
                   )}
                </div>

                <div className="space-y-6">
                   <div className="space-y-1 h-full flex flex-col">
                      <label className={inputLabelClass}>Açıklama</label>
                      <textarea 
                        rows={8}
                        defaultValue={isTrendyol(product) ? product.description : isHepsiburada(product) ? product.urunAciklamasi : ''} 
                        className={`${inputClass} flex-1 resize-none`} 
                      />
                   </div>
                   {isTrendyol(product) && (
                      <div className="bg-white/80 dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/10">
                         <h4 className="text-sm font-bold text-slate-900 dark:text-slate-300 mb-3 flex items-center gap-2">
                             <Layers size={14}/> Özellikler
                         </h4>
                         <div className="grid grid-cols-2 gap-3">
                            {product.attributes.map(attr => (
                               <div key={attr.attributeId} className="bg-white dark:bg-black/40 p-3 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col shadow-sm">
                                  <span className="text-[10px] uppercase text-slate-600 dark:text-slate-500 font-bold mb-1">{attr.attributeName}</span>
                                  <span className="text-sm font-bold text-slate-900 dark:text-slate-200">{attr.customAttributeValue || 'Standart'}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                   )}
                </div>
             </div>
          )}

          {/* PRICE & STOCK TAB */}
          {activeTab === 'price-stock' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                   <label className={inputLabelClass}>Stok Adedi</label>
                   <input 
                      type="number" 
                      defaultValue={isTrendyol(product) ? product.quantity : isHepsiburada(product) ? product.availableStock : 0} 
                      className={`${inputClass} font-mono text-lg`} 
                   />
                </div>
                <div className="space-y-2">
                   <label className={inputLabelClass}>Liste Fiyatı</label>
                   <div className="relative">
                      <input 
                         type="number" 
                         defaultValue={isTrendyol(product) ? product.listPrice : isHepsiburada(product) ? product.price : 0} 
                         className={`${inputClass} font-mono text-lg pl-8`} 
                      />
                      <span className="absolute left-3 top-3.5 text-slate-500">₺</span>
                   </div>
                </div>
                <div className="space-y-2">
                   <label className={inputLabelClass}>Satış Fiyatı</label>
                   <div className="relative">
                      <input 
                         type="number" 
                         defaultValue={isTrendyol(product) ? product.salePrice : isHepsiburada(product) ? product.price : 0} 
                         className={`${inputClass} border-green-500/30 text-green-700 dark:text-green-400 font-black font-mono text-lg pl-8`} 
                      />
                      <span className="absolute left-3 top-3.5 text-green-600/50">₺</span>
                   </div>
                </div>
                
                {isHepsiburada(product) && (
                    <div className="space-y-2">
                        <label className={inputLabelClass}>KDV Oranı</label>
                        <input type="number" defaultValue={product.taxVatRate} className={inputClass} />
                    </div>
                )}
                {isTrendyol(product) && (
                    <div className="space-y-2">
                        <label className={inputLabelClass}>KDV Oranı</label>
                        <input type="number" defaultValue={product.vatRate} className={inputClass} />
                    </div>
                )}

                <div className="col-span-3 bg-indigo-50/80 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-500/10 rounded-2xl p-5 mt-4">
                   <div className="flex items-start space-x-4">
                      <div className="p-3 bg-white dark:bg-indigo-500/10 rounded-xl shadow-sm">
                         <Activity size={24} className="text-indigo-600 dark:text-indigo-500" />
                      </div>
                      <div>
                         <h4 className="text-slate-900 dark:text-white font-bold">Hızlı Güncelleme</h4>
                         <p className="text-sm text-slate-700 dark:text-slate-400 mt-1 mb-3">Stok ve fiyat değişikliklerini anında pazaryerine göndermek için aşağıdaki butonu kullanın.</p>
                         <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20">
                            {platform === 'trendyol' ? 'Trendyol Stok & Fiyat Güncelle' : 'Hepsiburada Entegrasyon Güncelle'}
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* IMAGES TAB */}
          {activeTab === 'images' && (
             <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                   {(isTrendyol(product) ? product.images.map(i => i.url) : isHepsiburada(product) ? product.images : []).map((url, idx) => (
                      <div key={idx} className="group relative aspect-[3/4] bg-white dark:bg-black/40 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
                         <img src={url} alt={`Ürün ${idx}`} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 backdrop-blur-sm">
                            <button className="p-2 bg-red-500 rounded-full text-white shadow-lg transform hover:scale-110 transition-transform"><X size={16} /></button>
                         </div>
                         <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-md">
                            {idx === 0 ? 'Ana Görsel' : `Görsel ${idx + 1}`}
                         </span>
                      </div>
                   ))}
                   <button className="aspect-[3/4] bg-white/50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center text-slate-600 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-all">
                      <ImageIcon size={32} className="mb-2" />
                      <span className="text-sm font-medium">Görsel Ekle</span>
                   </button>
                </div>
             </div>
          )}
          
          {/* ... (Other tabs kept similar but using inputClass/inputLabelClass) ... */}
          {/* VARIANTS TAB (HB ONLY) */}
          {activeTab === 'variants' && isHepsiburada(product) && (
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                          <label className={inputLabelClass}>Varyant Grup ID</label>
                          <input type="text" defaultValue={product.varyantGroupId} className={inputClass} />
                      </div>
                  </div>
                  <div className="bg-white/80 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-300 mb-4">Varyant Özellikleri</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                              <label className={inputLabelClass}>Renk Varyantı</label>
                              <input type="text" defaultValue={product.renkVariantProperty} className={inputClass} placeholder="Örn: Siyah" />
                          </div>
                          <div className="space-y-1">
                              <label className={inputLabelClass}>Ebat/Beden Varyantı</label>
                              <input type="text" defaultValue={product.ebatlarVariantProperty} className={inputClass} placeholder="Örn: XL" />
                          </div>
                      </div>
                  </div>
              </div>
          )}
          
          {/* STATUS TAB ... uses same classes ... */}
          {activeTab === 'status' && (
             <div className="space-y-6">
                {isTrendyol(product) && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4 bg-white/80 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                         <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Ürün Durumu</h3>
                         {/* ... status badges ... */}
                         <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-white/5">
                            <span className="text-slate-800 dark:text-slate-400 font-bold">Onay Durumu</span>
                            <StatusBadge status={product.approved ? 'success' : 'warning'} text={product.approved ? 'Onaylandı' : 'Beklemede/Red'} />
                         </div>
                         <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-white/5">
                            <span className="text-slate-800 dark:text-slate-400 font-bold">Satış Durumu</span>
                            <StatusBadge status={product.onSale ? 'success' : 'neutral'} text={product.onSale ? 'Satışta' : 'Satışa Kapalı'} />
                         </div>
                         <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-white/5">
                            <span className="text-slate-800 dark:text-slate-400 font-bold">Arşiv</span>
                            <span className={`text-sm font-bold ${product.archived ? 'text-orange-600' : 'text-slate-700'}`}>{product.archived ? 'Arşivlenmiş' : 'Aktif'}</span>
                         </div>
                         {product.failureReasons && (
                            <div className="mt-4 bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/20 p-4 rounded-xl">
                               <h4 className="text-red-700 dark:text-red-500 text-sm font-bold mb-2 flex items-center gap-2"><Activity size={14}/> Hata Kayıtları:</h4>
                               <ul className="list-disc list-inside text-xs text-red-700 dark:text-red-400 space-y-1 font-semibold">
                                  {product.failureReasons.map((r, i) => <li key={i}>{r}</li>)}
                               </ul>
                            </div>
                         )}
                      </div>
                      <div className="space-y-4 bg-white/80 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                         <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Batch İşlemleri</h3>
                         <div className="space-y-2">
                            <label className={inputLabelClass}>Son Batch ID</label>
                            <div className="flex items-center gap-2">
                                <input type="text" readOnly value={product.batchRequestId || '-'} className={`${inputClass} font-mono text-xs`} />
                                <button className="p-3 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500"><Activity size={16}/></button>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className={inputLabelClass}>Batch Durumu</label>
                            <div className="flex items-center space-x-2 bg-white dark:bg-black/20 p-2 rounded-xl border border-slate-200 dark:border-white/5">
                               <StatusBadge 
                                  status={product.batchStatus === 'COMPLETED' ? 'success' : product.batchStatus === 'FAILED' ? 'error' : 'warning'} 
                                  text={product.batchStatus || 'Yok'} 
                               />
                               <span className="text-xs text-slate-600 ml-auto font-bold">{new Date(product.lastModified).toLocaleDateString()}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                )}
                {isHepsiburada(product) && (
                   <div className="space-y-4 bg-white/80 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Entegrasyon Durumu</h3>
                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <span className={inputLabelClass}>Inventory Upload ID</span>
                            <span className="text-sm text-slate-900 dark:text-white font-mono bg-white dark:bg-black/30 px-2 py-1 rounded border border-slate-200 dark:border-white/10 font-bold">{product.inventoryUploadId || 'Henüz Yüklenmedi'}</span>
                         </div>
                         <div>
                            <span className={inputLabelClass}>Yükleme Durumu</span>
                            <StatusBadge 
                               status={product.uploadStatus === 'Success' ? 'success' : product.uploadStatus === 'Error' ? 'error' : 'warning'} 
                               text={product.uploadStatus || 'Bilinmiyor'} 
                            />
                         </div>
                      </div>
                      {product.errorMessage && (
                         <div className="mt-4 bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/20 p-4 rounded-xl">
                             <h4 className="text-red-700 dark:text-red-500 text-sm font-bold mb-1">Hata: {product.errorMessage}</h4>
                             <p className="text-xs text-red-700/80 dark:text-red-400/80 font-semibold">{product.errorDetails}</p>
                         </div>
                      )}
                   </div>
                )}
             </div>
          )}

           {/* DELIVERY TAB ... uses same classes ... */}
           {activeTab === 'delivery' && (
              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className={inputLabelClass}>Kargo Firması</label>
                       <select className={`${inputClass} appearance-none cursor-pointer`}>
                          <option value="1">Yurtiçi Kargo</option>
                          <option value="2">Aras Kargo</option>
                          <option value="3">MNG Kargo</option>
                       </select>
                    </div>
                    {/* ... other inputs ... */}
                    <div className="space-y-2">
                       <label className={inputLabelClass}>Kargoya Veriliş Süresi (Gün)</label>
                       <input 
                          type="number" 
                          defaultValue={isTrendyol(product) ? product.deliveryOption.deliveryDuration : isHepsiburada(product) ? product.dispatchTime : 1} 
                          className={inputClass} 
                       />
                    </div>
                    {isTrendyol(product) && (
                       <>
                          <div className="space-y-2">
                             <label className={inputLabelClass}>Hızlı Teslimat Tipi</label>
                             <select className={inputClass} defaultValue={product.deliveryOption.fastDeliveryType}>
                                <option value="SAME_DAY">Aynı Gün</option>
                                <option value="FAST">Hızlı Teslimat</option>
                                <option value="">Yok</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className={inputLabelClass}>Sevkiyat Adres ID</label>
                             <input type="text" defaultValue={product.shipmentAddressId} className={inputClass} />
                          </div>
                          <div className="space-y-2">
                             <label className={inputLabelClass}>İade Adres ID</label>
                             <input type="text" defaultValue={product.returningAddressId} className={inputClass} />
                          </div>
                          <div className="space-y-2">
                             <label className={inputLabelClass}>Desi (Dimensional Weight)</label>
                             <input type="number" defaultValue={product.dimensionalWeight} className={inputClass} />
                          </div>
                       </>
                    )}
                 </div>
              </div>
           )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700/50 bg-slate-100/50 dark:bg-slate-900/50 flex justify-end space-x-4">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-bold">
            İptal
          </button>
          <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold shadow-xl shadow-indigo-500/30 flex items-center space-x-2 transform hover:scale-105 transition-all">
            <Save size={18} />
            <span>Kaydet & Güncelle</span>
          </button>
        </div>

      </GlassCard>
    </div>
  );
};