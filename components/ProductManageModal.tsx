'use client';

import React, { useState, useRef } from 'react';
import { X, Box, Tag, Image as ImageIcon, Truck, Activity, Layers, Sparkles, Save, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { enhanceTitle, enhanceDescription, type AIServiceError } from '@/lib/services/aiService';

interface ProductManageModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'general' | 'price' | 'media' | 'logistics' | 'status' | 'variants';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export const ProductManageModal: React.FC<ProductManageModalProps> = ({ product, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [aiOptimizing, setAiOptimizing] = useState<'title' | 'description' | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;

  const platformColor = product.platform === 'trendyol'
    ? 'from-orange-500 to-purple-600'
    : 'from-orange-500 to-red-600';

  const tabs = [
    { id: 'general', label: 'Genel Bilgiler', icon: Box },
    { id: 'price', label: 'Fiyat & Stok', icon: Tag },
    { id: 'media', label: 'Medya', icon: ImageIcon },
    { id: 'logistics', label: 'Lojistik', icon: Truck },
    { id: 'status', label: 'Durum/Entegrasyon', icon: Activity },
    ...(product.platform === 'hepsiburada' ? [{ id: 'variants', label: 'Varyantlar', icon: Layers }] : []),
  ] as const;

  // Toast yönetimi
  const showToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);

    // 5 saniye sonra otomatik kaldır
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // AI ile metin düzenleme
  const handleAiOptimize = async (field: 'title' | 'description') => {
    setAiOptimizing(field);

    try {
      // Input değerlerini al
      const currentText = field === 'title'
        ? titleInputRef.current?.value || product.title
        : descriptionInputRef.current?.value || (product.platform === 'trendyol' ? product.description : '');

      if (!currentText || currentText.trim() === '') {
        showToast('error', `Lütfen önce ${field === 'title' ? 'başlık' : 'açıklama'} girin`);
        setAiOptimizing(null);
        return;
      }

      // Backend API çağrısı
      showToast('info', 'AI düzenlemesi yapılıyor...');

      const response = field === 'title'
        ? await enhanceTitle(currentText, product.platform)
        : await enhanceDescription(currentText, product.platform);

      // Başarılı - input'u güncelle
      if (field === 'title' && titleInputRef.current) {
        titleInputRef.current.value = response.enhancedText;
      } else if (field === 'description' && descriptionInputRef.current) {
        descriptionInputRef.current.value = response.enhancedText;
      }

      showToast('success', `${field === 'title' ? 'Başlık' : 'Açıklama'} AI ile düzenlendi! (${response.originalLength} → ${response.enhancedLength} karakter)`);
    } catch (error) {
      const aiError = error as AIServiceError;
      console.error('AI Enhancement Error:', aiError);

      // Kullanıcıya anlamlı hata mesajı göster
      let errorMessage = 'AI düzenleme başarısız oldu';

      if (aiError.code === 'NETWORK_ERROR') {
        errorMessage = 'Backend bağlantısı kurulamadı. Lütfen backend\'inizin çalıştığından emin olun.';
      } else if (aiError.code?.startsWith('HTTP_')) {
        errorMessage = aiError.message || 'Sunucu hatası oluştu';
      }

      showToast('error', errorMessage);
    } finally {
      setAiOptimizing(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto pt-[75px] md:pt-0">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[60] space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

      {/* Modal Container */}
      <div className="glass-card w-full min-h-screen md:min-h-0 md:h-auto md:max-w-4xl md:max-h-[90vh] flex flex-col animate-slide-up md:rounded-2xl pb-8 md:pb-0">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex-1">
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-1.5">
              {product.title}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{product.barcode}</span>
              <div className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${platformColor} text-white text-[10px] font-bold uppercase`}>
                {product.platform}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1.5 px-4 py-3 border-b border-gray-200 dark:border-white/10 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pt-10 md:pt-4">
          {activeTab === 'general' && (
            <GeneralTab
              product={product}
              aiOptimizing={aiOptimizing}
              onAiOptimize={handleAiOptimize}
              titleInputRef={titleInputRef}
              descriptionInputRef={descriptionInputRef}
            />
          )}
          {activeTab === 'price' && <PriceTab product={product} />}
          {activeTab === 'media' && <MediaTab product={product} />}
          {activeTab === 'logistics' && <LogisticsTab product={product} />}
          {activeTab === 'status' && <StatusTab product={product} />}
          {activeTab === 'variants' && product.platform === 'hepsiburada' && <VariantsTab />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
          >
            İptal
          </button>
          <button className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:scale-105 active:scale-95">
            <Save size={16} />
            <span>Kaydet & Güncelle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Notification Component
const ToastNotification: React.FC<{ toast: Toast; onClose: (id: number) => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <AlertCircle size={18} />,
  };

  const colors = {
    success: 'from-emerald-500 to-green-600',
    error: 'from-red-500 to-rose-600',
    info: 'from-blue-500 to-indigo-600',
  };

  return (
    <div className={`glass-card p-3 pr-10 rounded-lg shadow-lg animate-slide-in-right border-l-4 bg-gradient-to-r ${colors[toast.type]} border-white relative`}>
      <div className="flex items-start space-x-2 text-white">
        <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
        <p className="text-sm font-medium leading-tight">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="absolute top-2 right-2 p-1 rounded hover:bg-white/20 transition-colors"
      >
        <X size={14} className="text-white" />
      </button>
    </div>
  );
};

// Tab Components
const GeneralTab: React.FC<{
  product: Product;
  aiOptimizing: 'title' | 'description' | null;
  onAiOptimize: (field: 'title' | 'description') => void;
  titleInputRef: React.RefObject<HTMLInputElement>;
  descriptionInputRef: React.RefObject<HTMLTextAreaElement>;
}> = ({ product, aiOptimizing, onAiOptimize, titleInputRef, descriptionInputRef }) => (
  <div className="space-y-4">
    {/* Title with AI */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Ürün Başlığı</label>
      <div className="relative">
        <input
          ref={titleInputRef}
          type="text"
          defaultValue={product.title}
          className={`w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
            aiOptimizing === 'title' ? 'border-purple-500 animate-pulse-glow' : 'border-gray-200 dark:border-white/10'
          }`}
          disabled={aiOptimizing === 'title'}
        />
        <button
          onClick={() => onAiOptimize('title')}
          disabled={aiOptimizing !== null}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          title="AI ile düzenle"
        >
          <Sparkles size={16} className={`${aiOptimizing === 'title' ? 'text-purple-500 animate-spin' : 'text-gray-400 group-hover:text-purple-500'}`} />
        </button>
      </div>
    </div>

    {/* Barcode (Locked) */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Barkod (Değiştirilemez)</label>
      <input
        type="text"
        value={product.barcode}
        disabled
        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-white/5 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
      />
    </div>

    {/* SKU Fields (Hepsiburada) */}
    {product.platform === 'hepsiburada' && (
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Hepsiburada SKU</label>
          <input
            type="text"
            defaultValue={product.hepsiburadaSku}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Merchant SKU
            <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-1">(Büyük harf, boşluksuz)</span>
          </label>
          <input
            type="text"
            defaultValue={product.merchantSku}
            onChange={(e) => {
              // Auto-format: uppercase and remove spaces
              e.target.value = e.target.value.toUpperCase().replace(/\s/g, '');
            }}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    )}

    {/* Stock Code (Trendyol) */}
    {product.platform === 'trendyol' && (
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Stok Kodu</label>
        <input
          type="text"
          defaultValue={product.stockCode}
          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    )}

    {/* Brand & Category */}
    {product.platform === 'trendyol' && (
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Marka</label>
          <input type="text" defaultValue={product.brandName} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Kategori ID</label>
          <input type="text" defaultValue={product.categoryId} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
    )}

    {/* Description with AI */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Açıklama</label>
      <div className="relative">
        <textarea
          ref={descriptionInputRef}
          defaultValue={product.platform === 'trendyol' ? product.description : ''}
          rows={3}
          className={`w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none ${
            aiOptimizing === 'description' ? 'border-purple-500 animate-pulse-glow' : 'border-gray-200 dark:border-white/10'
          }`}
          disabled={aiOptimizing === 'description'}
        />
        <button
          onClick={() => onAiOptimize('description')}
          disabled={aiOptimizing !== null}
          className="absolute right-2 top-2 p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          title="AI ile düzenle"
        >
          <Sparkles size={16} className={`${aiOptimizing === 'description' ? 'text-purple-500 animate-spin' : 'text-gray-400 group-hover:text-purple-500'}`} />
        </button>
      </div>
    </div>

    {/* Attributes (Trendyol) */}
    {product.platform === 'trendyol' && product.attributes.length > 0 && (
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Özellikler</label>
        <div className="flex flex-wrap gap-1.5">
          {product.attributes.map((attr, idx) => (
            <span key={idx} className="px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200 dark:border-indigo-500/30">
              {attr.attributeId}: {attr.attributeValueId || attr.customAttributeValue}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const PriceTab: React.FC<{ product: Product }> = ({ product }) => {
  const price = product.platform === 'trendyol' ? product.salePrice : product.price;
  const listPrice = product.platform === 'trendyol' ? product.listPrice : 0;
  const stock = product.platform === 'trendyol' ? product.quantity : product.availableStock;

  return (
    <div className="space-y-4">
      {/* Stock */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Stok Adedi</label>
        <input
          type="number"
          defaultValue={stock}
          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-3">
        {product.platform === 'trendyol' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Liste Fiyatı</label>
            <input
              type="number"
              defaultValue={listPrice}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-500 dark:text-gray-400 line-through focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Satış Fiyatı</label>
          <input
            type="number"
            defaultValue={price}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* VAT (Trendyol) */}
      {product.platform === 'trendyol' && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">KDV Oranı (%)</label>
          <input
            type="number"
            defaultValue={product.vatRate}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Quick Update Box */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border-2 border-indigo-200 dark:border-indigo-500/30">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">⚡ Hızlı Güncelleme</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          Sadece fiyat ve stoğu pazaryerine anında gönder
        </p>
        <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg">
          Hızlı Stok/Fiyat Güncelle
        </button>
      </div>
    </div>
  );
};

const MediaTab: React.FC<{ product: Product }> = ({ product }) => {
  const images = product.platform === 'trendyol' ? product.images : [{ url: product.image }];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 hover:border-indigo-500 transition-all">
            <img src={img.url} alt={`Görsel ${idx + 1}`} className="w-full h-full object-cover" />
            {idx === 0 && (
              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                Ana Görsel
              </div>
            )}
            <button className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={20} className="text-white" />
            </button>
          </div>
        ))}
        {/* Add New Image Box */}
        <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-indigo-500 transition-all flex flex-col items-center justify-center cursor-pointer group">
          <ImageIcon size={24} className="text-gray-400 group-hover:text-indigo-500 mb-1.5" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-indigo-500">Görsel Ekle</span>
        </div>
      </div>
    </div>
  );
};

const LogisticsTab: React.FC<{ product: Product }> = ({ product }) => (
  <div className="space-y-4">
    {product.platform === 'trendyol' ? (
      <>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Kargo Firması</label>
          <select className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value={product.cargoCompanyId}>{product.cargoCompanyId}</option>
            <option value="YurticiKargo">Yurtiçi Kargo</option>
            <option value="Aras">Aras Kargo</option>
            <option value="MNG">MNG Kargo</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Teslimat Süresi (Gün)</label>
            <input type="number" defaultValue={product.deliveryOption.deliveryDuration} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Desi</label>
            <input type="number" step="0.1" defaultValue={product.dimensionalWeight} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </>
    ) : (
      <>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Kargoya Veriliş Süresi (Gün)</label>
          <input type="number" defaultValue={product.dispatchTime} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Kargo Firması 1</label>
            <input type="text" defaultValue={product.cargoCompany1} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          {product.cargoCompany2 && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Kargo Firması 2</label>
              <input type="text" defaultValue={product.cargoCompany2} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          )}
        </div>
      </>
    )}
  </div>
);

const StatusTab: React.FC<{ product: Product }> = ({ product }) => (
  <div className="space-y-4">
    {product.platform === 'trendyol' ? (
      <>
        {/* Status Badges */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Durum Rozetleri</label>
          <div className="flex flex-wrap gap-2">
            <StatusBadge active={product.approved} label="Onaylandı" color="emerald" />
            <StatusBadge active={product.onSale} label="Satışta" color="blue" />
            <StatusBadge active={product.archived} label="Arşiv" color="gray" />
            <StatusBadge active={product.rejected} label="Reddedildi" color="red" />
            <StatusBadge active={product.blacklisted} label="Kara Liste" color="red" />
          </div>
        </div>

        {/* Batch Info */}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Batch İşlem Geçmişi</h3>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Batch ID:</span>
              <span className="text-xs font-mono font-semibold text-gray-900 dark:text-white">{product.batchRequestId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Durum:</span>
              <span className={`text-xs font-bold ${product.batchStatus === 'success' ? 'text-emerald-500' : product.batchStatus === 'pending' ? 'text-amber-500' : 'text-red-500'}`}>
                {product.batchStatus === 'success' ? 'Başarılı' : product.batchStatus === 'pending' ? 'Beklemede' : 'Hatalı'}
              </span>
            </div>
          </div>
          {product.failureReasons.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
              <p className="text-xs font-semibold text-red-900 dark:text-red-300 mb-1.5">Hata Nedenleri:</p>
              <ul className="list-disc list-inside text-xs text-red-700 dark:text-red-400 space-y-0.5">
                {product.failureReasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </>
    ) : (
      <>
        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button className="flex-1 px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-sm font-bold hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-all border-2 border-emerald-300 dark:border-emerald-500/30">
            Satışa Aç
          </button>
          <button className="flex-1 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 text-sm font-bold hover:bg-red-200 dark:hover:bg-red-500/30 transition-all border-2 border-red-300 dark:border-red-500/30">
            Satışa Kapat
          </button>
        </div>

        {/* Upload Status */}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Envanter Upload Durumu</h3>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Upload ID:</span>
              <span className="text-xs font-mono font-semibold text-gray-900 dark:text-white">{product.inventoryUploadId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Durum:</span>
              <span className={`text-xs font-bold ${product.uploadStatus === 'Success' ? 'text-emerald-500' : product.uploadStatus === 'Pending' ? 'text-amber-500' : 'text-red-500'}`}>
                {product.uploadStatus === 'Success' ? 'Başarılı' : product.uploadStatus === 'Pending' ? 'Beklemede' : 'Hatalı'}
              </span>
            </div>
          </div>
          {product.errorMessage && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
              <p className="text-xs font-semibold text-red-900 dark:text-red-300 mb-1">{product.errorMessage}</p>
              {product.errorDetails && (
                <p className="text-xs text-red-700 dark:text-red-400">{product.errorDetails}</p>
              )}
            </div>
          )}
        </div>
      </>
    )}
  </div>
);

const VariantsTab: React.FC = () => (
  <div className="space-y-4">
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Varyant Grup ID</label>
      <input type="text" placeholder="VG-12345" className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Renk</label>
        <input type="text" placeholder="Siyah" className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Beden</label>
        <input type="text" placeholder="XL" className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
    </div>
  </div>
);

const StatusBadge: React.FC<{ active: boolean; label: string; color: string }> = ({ active, label, color }) => {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30',
    blue: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/30',
    gray: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-500/30',
    red: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-500/30',
  };

  return (
    <div className={`px-3 py-1.5 rounded-lg border-2 ${active ? colorMap[color] : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-700 opacity-50'}`}>
      <span className="text-xs font-bold">{label}</span>
    </div>
  );
};
