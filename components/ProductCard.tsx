'use client';

import React from 'react';
import { Package, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, Edit2 } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onManage: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onManage }) => {
  const getStatusConfig = () => {
    if (product.platform === 'trendyol') {
      if (product.approved && product.onSale) {
        return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Satışta' };
      } else if (product.approved) {
        return { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Onaylı' };
      } else if (product.rejected) {
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Reddedildi' };
      } else {
        return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Beklemede' };
      }
    } else {
      // Hepsiburada
      if (product.uploadStatus === 'Success' && product.listingStatus === 'active') {
        return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Aktif' };
      } else if (product.uploadStatus === 'Error') {
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Hata' };
      } else if (product.uploadStatus === 'Pending') {
        return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Beklemede' };
      } else {
        return { icon: Package, color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Pasif' };
      }
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const platformColor = product.platform === 'trendyol'
    ? 'from-orange-500 to-purple-600'
    : 'from-orange-500 to-red-600';

  const getStock = () => product.platform === 'trendyol' ? product.quantity : product.availableStock;
  const getPrice = () => product.platform === 'trendyol' ? product.salePrice : product.price;
  const getImage = () => {
    if (product.platform === 'trendyol') {
      return product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/200';
    }
    return product.image;
  };

  const stock = getStock();
  const stockStatus = stock < 10
    ? { icon: TrendingDown, color: 'text-red-500', label: 'Kritik' }
    : stock < 50
    ? { icon: AlertCircle, color: 'text-amber-500', label: 'Düşük' }
    : { icon: TrendingUp, color: 'text-emerald-500', label: 'İyi' };

  const StockIcon = stockStatus.icon;

  return (
    <div className="glass-card glass-shine p-4 group hover:scale-[1.01] transition-all duration-300">
      {/* Header: Platform Badge + Status */}
      <div className="flex items-center justify-between mb-3">
        <div className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${platformColor} text-white text-[10px] font-bold uppercase tracking-wide`}>
          {product.platform}
        </div>
        <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full ${statusConfig.bg}`}>
          <StatusIcon size={12} className={statusConfig.color} />
          <span className={`text-[10px] font-semibold ${statusConfig.color}`}>{statusConfig.label}</span>
        </div>
      </div>

      {/* Product Image + Info */}
      <div className="flex items-start space-x-3 mb-3">
        {/* Image */}
        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 group-hover:border-indigo-500 transition-colors duration-300">
          <img
            src={getImage()}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.title}
          </h3>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">{product.barcode}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* Price */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Fiyat</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">₺{getPrice().toLocaleString('tr-TR')}</span>
        </div>

        {/* Stock */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Stok</span>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{stock}</span>
            <StockIcon size={14} className={stockStatus.color} />
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Güncelleme</span>
          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">{product.lastUpdated}</span>
        </div>
      </div>

      {/* Platform Specific Info */}
      {product.platform === 'trendyol' && (
        <div className="mb-3 pt-2 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-500 dark:text-gray-400">Onay Durumu:</span>
            <span className={`font-semibold ${
              product.approved ? 'text-emerald-500' :
              'text-amber-500'
            }`}>
              {product.approved ? 'Onaylandı' : 'Bekliyor'}
            </span>
          </div>
        </div>
      )}

      {product.platform === 'hepsiburada' && (
        <div className="mb-3 pt-2 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-500 dark:text-gray-400">HB SKU:</span>
            <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">{product.hepsiburadaSku}</span>
          </div>
        </div>
      )}

      {/* Manage Button */}
      <button
        onClick={() => onManage(product)}
        className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/30 hover:shadow-lg hover:scale-[1.02] active:scale-95"
      >
        <Edit2 size={14} />
        <span>Yönet</span>
      </button>
    </div>
  );
};
