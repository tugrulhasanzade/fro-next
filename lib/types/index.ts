// Platform Types
export type Platform = 'trendyol' | 'hepsiburada';
export type ProductStatus = 'active' | 'pending' | 'rejected' | 'draft';

// Trendyol Types
export interface TrendyolAttribute {
  attributeId: string;
  attributeValueId?: string;
  customAttributeValue?: string;
}

export interface TrendyolImage {
  url: string;
}

export interface TrendyolDeliveryOption {
  deliveryDuration: number;
  fastDeliveryType: 'same-day' | 'fast' | 'standard';
}

export interface TrendyolProduct {
  platform: 'trendyol';
  title: string;
  barcode: string;
  productMainId: string;
  stockCode: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  salePrice: number;
  listPrice: number;
  vatRate: number;
  currencyType: string;
  dimensionalWeight: number;
  description: string;
  cargoCompanyId: string;
  shipmentAddressId: string;
  returningAddressId: string;
  deliveryOption: TrendyolDeliveryOption;
  attributes: TrendyolAttribute[];
  images: TrendyolImage[];
  approved: boolean;
  archived: boolean;
  onSale: boolean;
  rejected: boolean;
  blacklisted: boolean;
  batchRequestId: string;
  batchStatus: 'success' | 'pending' | 'failed';
  failureReasons: string[];
  lastUpdated: string;
}

// Hepsiburada Types
export interface HepsiburadaProduct {
  platform: 'hepsiburada';
  title: string;
  barcode: string;
  hepsiburadaSku: string;
  merchantSku: string;
  price: number;
  availableStock: number;
  dispatchTime: number;
  cargoCompany1: string;
  cargoCompany2?: string;
  cargoCompany3?: string;
  shippingAddressLabel?: string;
  shippingProfileName?: string;
  inventoryUploadId: string;
  uploadStatus: 'Success' | 'Error' | 'Pending';
  errorMessage?: string;
  errorDetails?: string;
  image: string;
  lastUpdated: string;
  listingStatus: 'active' | 'inactive';
}

export type Product = TrendyolProduct | HepsiburadaProduct;

// Pagination Types
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Filter Types
export interface TrendyolFilters {
  search: string;
  statusFilter: string;
  brandIds: string[];
  startDate: string;
  endDate: string;
  dateQueryType: 'created' | 'lastModified';
}

export interface HepsiburadaFilters {
  search: string;
  listingStatus: 'all' | 'salable' | 'notsalable';
  updateStartDate: string;
  updateEndDate: string;
  productId: string;
}
