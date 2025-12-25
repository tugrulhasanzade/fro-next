
// Ortak Tipler
export type Platform = 'trendyol' | 'hepsiburada';

// TRENDYOL TİPLERİ
export interface TrendyolAttribute {
  attributeId: number;
  attributeName: string;
  attributeValueId: number | null;
  customAttributeValue: string | null;
}

export interface TrendyolImage {
  url: string;
}

export interface TrendyolProduct {
  id: string; // Internal ID
  barcode: string;
  title: string;
  productMainId: string;
  stockCode: string;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  quantity: number;
  listPrice: number;
  salePrice: number;
  vatRate: number;
  currencyType: string;
  dimensionalWeight: number; // Desi
  description: string;
  cargoCompanyId: number;
  shipmentAddressId: number;
  returningAddressId: number;
  deliveryOption: {
    deliveryDuration: number;
    fastDeliveryType: string;
  };
  images: TrendyolImage[];
  attributes: TrendyolAttribute[];
  // Durum Alanları
  approved: boolean;
  archived: boolean;
  onSale: boolean;
  rejected: boolean;
  blacklisted: boolean;
  // Batch / Senkron Takibi
  batchRequestId?: string;
  batchStatus?: 'PENDING' | 'COMPLETED' | 'FAILED';
  failureReasons?: string[];
  lastModified: number; // timestamp
  lastSyncAt?: number; // Backend senkron zamanı
}

// HEPSİBURADA TİPLERİ
export interface HepsiburadaProduct {
  id: string; // Internal ID
  // Listing Alanları
  hepsiburadaSku?: string;
  merchantSku: string;
  price: number;
  availableStock: number;
  dispatchTime: number;
  cargoCompany1: string;
  cargoCompany2?: string; // Opsiyonel
  cargoCompany3?: string; // Opsiyonel
  shippingAddressLabel?: string; // Varsa
  shippingProfileName?: string; // Varsa
  // Katalog Takip
  merchantId: string;
  categoryId: string;
  barcode: string;
  urunAdi: string;
  urunAciklamasi: string;
  marka: string;
  garantiSuresi?: number;
  kg?: number;
  taxVatRate?: number;
  images: string[]; // Image1..Image5
  video?: string;
  varyantGroupId?: string;
  renkVariantProperty?: string;
  ebatlarVariantProperty?: string;
  // Senkron Takibi
  inventoryUploadId?: string;
  uploadStatus?: 'Waiting' | 'Processing' | 'Success' | 'Error';
  errorMessage?: string;
  errorDetails?: string;
  updateDate: number; // timestamp
  lastSyncAt?: number; // Backend senkron zamanı
}

export interface FilterState {
  // Ortak / Trendyol
  search: string; // barcode, name, sku
  status: string; // approved, onSale etc.
  startDate: string;
  endDate: string;
  brand: string;
  // Trendyol Specific
  dateQueryType?: 'created' | 'lastModified';
  page?: number;
  size?: number;
  
  // Hepsiburada Specific
  productId?: string;
  offset?: number;
  limit?: number;
}
