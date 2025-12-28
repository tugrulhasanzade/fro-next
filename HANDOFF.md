# 🔌 Backend Entegrasyon Rehberi (HANDOFF)

> **Backend Ekibi İçin:** Bu dosya, frontend'i backend API'lerinize nasıl bağlayacağınızı adım adım anlatır.

---

## 📋 İçindekiler

1. [Genel Bakış](#-genel-bakış)
2. [Mock Data Lokasyonu](#-mock-data-lokasyonu)
3. [Type Definitions](#-type-definitions)
4. [API Entegrasyon Noktaları](#-api-entegrasyon-noktaları)
5. [Örnek API Request/Response](#-örnek-api-requestresponse)
6. [State Yönetimi Önerileri](#-state-yönetimi-önerileri)
7. [Error Handling](#-error-handling)
8. [Loading States](#-loading-states)
9. [Checklist](#-entegrasyon-checklist)

---

## 🎯 Genel Bakış

### Mevcut Durum
Frontend **tamamen hazır** ve **mock data** ile çalışıyor. UI, bileşenler, stil, animasyonlar - hepsi tamamlanmış durumda.

### Yapılması Gerekenler
1. Mock data'yı kaldırın
2. API servis katmanı ekleyin
3. Frontend'deki 3 ana noktada API çağrılarını entegre edin
4. Error handling ve loading state'leri ekleyin

**Tahmini Süre:** 2-4 saat

---

## 📦 Mock Data Lokasyonu

### Dosya: `lib/mockData.ts`

Bu dosyada 2 ana array var:

```typescript
export const MOCK_TRENDYOL_PRODUCTS: TrendyolProduct[] = [
  // 3 örnek Trendyol ürünü
];

export const MOCK_HEPSIBURADA_PRODUCTS: HepsiburadaProduct[] = [
  // 3 örnek Hepsiburada ürünü
];
```

**Not:** Bu dosyayı silebilir veya test amaçlı tutabilirsiniz. Tamamen size kalmış.

---

## 📝 Type Definitions

### Dosya: `lib/types/index.ts`

Backend API response'larınız **TAM OLARAK** bu tiplere uygun olmalı.

### Platform Types
```typescript
export type Platform = 'trendyol' | 'hepsiburada';
export type ProductStatus = 'active' | 'pending' | 'rejected' | 'draft';
```

### Trendyol Product Interface
```typescript
export interface TrendyolProduct {
  id: string;
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
  deliveryOption: {
    deliveryDuration: number;
    fastDeliveryType: 'same-day' | 'fast' | 'standard';
  };
  attributes: Array<{
    attributeId: string;
    attributeValueId?: string;
    customAttributeValue?: string;
  }>;
  images: Array<{
    url: string;
  }>;
  approved: boolean;
  archived: boolean;
  onSale: boolean;
  rejected: boolean;
  blacklisted: boolean;
  lastSyncAt: string;
  batchRequestId: string;
  batchStatus: 'success' | 'pending' | 'failed';
  failureReasons: string[];
  status: ProductStatus;
  lastUpdated: string;
}
```

### Hepsiburada Product Interface
```typescript
export interface HepsiburadaProduct {
  id: string;
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
  lastSyncAt: string;
  inventoryUploadId: string;
  uploadStatus: 'Success' | 'Error' | 'Pending';
  errorMessage?: string;
  errorDetails?: string;
  image: string;
  status: ProductStatus;
  lastUpdated: string;
  listingStatus: 'active' | 'inactive';
}
```

**Önemli:** Backend'inizde bu fieldler farklı isimlerdeyse, bir **mapper fonksiyonu** yazın ve frontend'e bu formatta gönderin.

---

## 🔌 API Entegrasyon Noktaları

### 1️⃣ Ürün Listesi Çekme (En Önemli)

**Dosya:** `app/page.tsx`
**Satırlar:** 44-46

#### Mevcut Kod:
```typescript
const allProducts = selectedPlatform === 'trendyol'
  ? MOCK_TRENDYOL_PRODUCTS
  : MOCK_HEPSIBURADA_PRODUCTS;
```

#### Değiştirilecek Kod:

```typescript
'use client';

import React, { useState, useEffect } from 'react';
// ... diğer importlar

export default function Home() {
  // ... mevcut state'ler

  // YENİ STATE'LER
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // YENİ useEffect - Ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/products?platform=${selectedPlatform}`,
          {
            headers: {
              'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`, // Auth token'ınızı buraya
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Ürünler yüklenemedi');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedPlatform]); // Platform değiştiğinde yeniden çek

  // ESKİ satırları SİL:
  // const allProducts = selectedPlatform === 'trendyol'
  //   ? MOCK_TRENDYOL_PRODUCTS
  //   : MOCK_HEPSIBURADA_PRODUCTS;

  // YENİ - products state'ini kullan
  const allProducts = products;

  // ... filteredProducts kısmı aynı kalacak
}
```

---

### 2️⃣ Listeyi Yenile Butonu

**Dosya:** `app/page.tsx`
**Satırlar:** 89-92

#### Mevcut Kod:
```typescript
const handleRefresh = () => {
  console.log(`Refreshing ${selectedPlatform} products...`);
  // Backend API call buraya gelecek
};
```

#### Değiştirilecek Kod:

```typescript
const handleRefresh = async () => {
  setLoading(true);
  setError(null);

  try {
    // Backend'den yenileme işlemini tetikle
    const response = await fetch(
      `/api/products/refresh?platform=${selectedPlatform}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Yenileme başarısız');
    }

    // Başarılıysa, listeyi yeniden çek
    const productsResponse = await fetch(
      `/api/products?platform=${selectedPlatform}`,
      {
        headers: {
          'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await productsResponse.json();
    setProducts(data);

    // Opsiyonel: Toast notification göster
    console.log('Liste başarıyla yenilendi!');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Yenileme başarısız');
  } finally {
    setLoading(false);
  }
};
```

---

### 3️⃣ Ürün Güncelleme (Modal'dan)

**Dosya:** `components/ProductManageModal.tsx`
**Satırlar:** Footer kısmı (Save button)

#### Mevcut Kod:
```typescript
<button className="... bg-gradient-to-r from-indigo-600 to-purple-600 ...">
  <Save size={16} />
  <span>Kaydet & Güncelle</span>
</button>
```

#### Değiştirilecek Kod:

```typescript
// Modal component'inin içinde state ekle:
const [saving, setSaving] = useState(false);

// Save handler fonksiyonu ekle:
const handleSave = async () => {
  setSaving(true);

  try {
    const response = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Form'dan topladığınız güncellenmiş data
        // Örnek:
        title: updatedTitle,
        quantity: updatedQuantity,
        salePrice: updatedPrice,
        // ... diğer fieldler
      }),
    });

    if (!response.ok) {
      throw new Error('Güncelleme başarısız');
    }

    // Başarılı - Modal'ı kapat ve parent'ı bilgilendir
    onClose();

    // Opsiyonel: Parent component'te listeyi yenile
    // Bu kısım için parent component'e bir callback prop ekleyebilirsiniz
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Güncelleme başarısız');
  } finally {
    setSaving(false);
  }
};

// Button'u güncelle:
<button
  onClick={handleSave}
  disabled={saving}
  className="..."
>
  <Save size={16} />
  <span>{saving ? 'Kaydediliyor...' : 'Kaydet & Güncelle'}</span>
</button>
```

---

## 📡 Örnek API Request/Response

### 1. GET - Ürün Listesi

#### Request:
```http
GET /api/products?platform=trendyol
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

#### Response (200 OK):
```json
[
  {
    "id": "TY-001",
    "platform": "trendyol",
    "title": "Örnek Ürün",
    "barcode": "1234567890123",
    "productMainId": "123456789",
    "stockCode": "STK-001",
    "brandId": "1001",
    "brandName": "Marka A",
    "categoryId": "5001",
    "categoryName": "Elektronik",
    "quantity": 100,
    "salePrice": 299.99,
    "listPrice": 399.99,
    "vatRate": 18,
    "currencyType": "TRY",
    "dimensionalWeight": 2.5,
    "description": "Ürün açıklaması",
    "cargoCompanyId": "Aras",
    "shipmentAddressId": "ADDR-001",
    "returningAddressId": "ADDR-002",
    "deliveryOption": {
      "deliveryDuration": 3,
      "fastDeliveryType": "fast"
    },
    "attributes": [
      {
        "attributeId": "color",
        "attributeValueId": "red",
        "customAttributeValue": null
      }
    ],
    "images": [
      {
        "url": "https://cdn.example.com/image1.jpg"
      }
    ],
    "approved": true,
    "archived": false,
    "onSale": true,
    "rejected": false,
    "blacklisted": false,
    "lastSyncAt": "2025-12-27T10:30:00Z",
    "batchRequestId": "BATCH-001",
    "batchStatus": "success",
    "failureReasons": [],
    "status": "active",
    "lastUpdated": "2 saat önce"
  }
  // ... daha fazla ürün
]
```

### 2. POST - Listeyi Yenile

#### Request:
```http
POST /api/products/refresh?platform=trendyol
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Trendyol ürünleri yenilendi",
  "syncedAt": "2025-12-27T10:35:00Z",
  "productsCount": 156
}
```

### 3. PUT - Ürün Güncelle

#### Request:
```http
PUT /api/products/TY-001
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "Güncellenmiş Ürün Başlığı",
  "quantity": 150,
  "salePrice": 279.99,
  "description": "Yeni açıklama"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Ürün güncellendi",
  "product": {
    "id": "TY-001",
    // ... güncellenmiş ürün datası
  }
}
```

---

## 🎨 State Yönetimi Önerileri

### Basit Yaklaşım (Mevcut Durum)
```typescript
// useState ile local state yönetimi
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(false);
```

✅ **장점장점:**
- Basit
- Ekstra kütüphane gerektirmez
- Bu proje için yeterli

❌ **Eksi:**
- Cache yok
- Her platform değişiminde yeniden fetch
- Optimistic updates yok

### Gelişmiş Yaklaşım (Opsiyonel - React Query)

Eğer turkwise ana projesinde React Query kullanılıyorsa:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Ürünleri çek
const { data: products, isLoading, error } = useQuery({
  queryKey: ['products', selectedPlatform],
  queryFn: () => fetchProducts(selectedPlatform),
});

// Yenileme mutation
const refreshMutation = useMutation({
  mutationFn: (platform: Platform) => refreshProducts(platform),
  onSuccess: () => {
    queryClient.invalidateQueries(['products', selectedPlatform]);
  },
});
```

✅ **장점장점:**
- Otomatik caching
- Background refetch
- Optimistic updates
- Retry logic
- Loading/error states otomatik

---

## 🚨 Error Handling

### 1. API Error Response Formatı

Backend'inizin error response'u şu formatta olmalı:

```json
{
  "error": true,
  "message": "Kullanıcı dostu hata mesajı",
  "code": "PRODUCT_NOT_FOUND",
  "details": {
    "field": "productId",
    "reason": "Ürün bulunamadı"
  }
}
```

### 2. Frontend Error Handling

```typescript
try {
  const response = await fetch('/api/products');

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Bir hata oluştu');
  }

  const data = await response.json();
  setProducts(data);
} catch (err) {
  // Kullanıcıya göster
  setError(err instanceof Error ? err.message : 'Bilinmeyen hata');

  // Console'a log
  console.error('API Error:', err);
}
```

### 3. Error UI

`app/page.tsx` içinde error state için UI ekleyin:

```typescript
{error && (
  <div className="glass-card p-4 mb-6 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30">
    <p className="text-sm text-red-700 dark:text-red-300">
      ⚠️ {error}
    </p>
    <button
      onClick={() => setError(null)}
      className="text-xs text-red-500 hover:text-red-700 mt-2"
    >
      Kapat
    </button>
  </div>
)}
```

---

## ⏳ Loading States

### 1. Loading UI

`app/page.tsx` içinde loading state için:

```typescript
{loading && (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    <span className="ml-3 text-gray-600 dark:text-gray-400">
      Ürünler yükleniyor...
    </span>
  </div>
)}

{!loading && filteredProducts.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Ürün kartları */}
  </div>
)}
```

### 2. Skeleton Loader (Opsiyonel)

Daha iyi UX için skeleton loader ekleyebilirsiniz:

```typescript
{loading && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="glass-card p-4 animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    ))}
  </div>
)}
```

---

## 🔐 Authentication

### Frontend Tarafı

Eğer turkwise ana projesindeki auth sistemini kullanacaksanız:

```typescript
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  useEffect(() => {
    if (!token) return;

    const fetchProducts = async () => {
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // ...
    };

    fetchProducts();
  }, [token, selectedPlatform]);
}
```

### Backend Tarafı

Backend'iniz bu sayfaya erişimi kontrol etmelidir:
- JWT token validation
- User role check (sadece admin/authorized users)
- Company/merchant filtering

---

## ✅ Entegrasyon Checklist

### 🟦 Backend Tarafı (Sizin Yapmanız Gerekenler)

- [ ] **API Endpoint'leri Hazırlayın:**
  - [ ] `GET /api/products?platform={trendyol|hepsiburada}`
  - [ ] `POST /api/products/refresh?platform={trendyol|hepsiburada}`
  - [ ] `PUT /api/products/:id`

- [ ] **Type Uyumu Sağlayın:**
  - [ ] Response'lar `lib/types/index.ts`'deki interface'lere uygun
  - [ ] Eğer farklıysa mapper fonksiyonu yazın

- [ ] **Auth & Security:**
  - [ ] JWT token validation
  - [ ] CORS ayarları
  - [ ] Rate limiting
  - [ ] Input validation

- [ ] **Error Handling:**
  - [ ] Standart error response formatı
  - [ ] HTTP status code'ları doğru
  - [ ] Kullanıcı dostu error mesajları

- [ ] **Testing:**
  - [ ] API endpoint'lerini Postman/Insomnia ile test edin
  - [ ] Response format'larını doğrulayın

### 🟩 Frontend Tarafı (Backend Ekibinin Yapması Gerekenler)

- [ ] **app/page.tsx Güncellemeleri:**
  - [ ] Mock data yerine API call
  - [ ] `useState` ile products state
  - [ ] `useEffect` ile initial fetch
  - [ ] Loading state UI
  - [ ] Error state UI

- [ ] **handleRefresh Fonksiyonu:**
  - [ ] API call ekle
  - [ ] Loading state
  - [ ] Success/error handling

- [ ] **ProductManageModal:**
  - [ ] Save button'a API call ekle
  - [ ] Form data toplama
  - [ ] Saving state

- [ ] **Opsiyonel İyileştirmeler:**
  - [ ] React Query entegrasyonu
  - [ ] Toast notifications
  - [ ] Optimistic updates
  - [ ] Skeleton loaders

---

## 🧪 Test Senaryoları

### 1. Sayfa İlk Yüklenme
- [ ] Trendyol seçili olarak açılır
- [ ] Trendyol ürünleri API'den çekilir
- [ ] Loading state gösterilir
- [ ] Ürünler listelenir

### 2. Platform Değiştirme
- [ ] Hepsiburada tab'ine tıklayınca
- [ ] Hepsiburada ürünleri API'den çekilir
- [ ] Loading state gösterilir
- [ ] Liste güncellenir

### 3. Listeyi Yenile
- [ ] Refresh button'a tıklayınca
- [ ] API'ye POST request gider
- [ ] Loading state gösterilir
- [ ] Liste yeniden çekilir

### 4. Ürün Düzenleme
- [ ] Yönet button'a tıklayınca modal açılır
- [ ] Form'da değişiklik yapınca
- [ ] Kaydet button'a tıklayınca API'ye PUT request gider
- [ ] Modal kapanır ve liste güncellenir

### 5. Error Handling
- [ ] API offline olunca error mesajı gösterilir
- [ ] 401 Unauthorized'da login'e yönlendirilir
- [ ] Network error'da retry seçeneği sunulur

---

## 📞 Destek

Entegrasyon sırasında sorularınız olursa:

**Frontend Team:**
- Email: frontend@turkwise.com.tr
- Slack: #frontend-team

**Sorular:**
1. "Bu field backend'de farklı isimde, ne yapmalıyım?"
   → Mapper fonksiyonu yazın ve frontend'e doğru formatta gönderin

2. "Error handling nasıl olmalı?"
   → Bu dokümandaki format'ı kullanın

3. "Authentication nasıl çalışacak?"
   → NextAuth token'ı Authorization header'da gönderin

4. "Pagination gerekli mi?"
   → Şimdilik hayır, ileride eklenebilir

---

## 🎉 Tamamlama

Entegrasyon tamamlandığında:

1. ✅ Tüm checklist item'ları tamamlandı
2. ✅ Test senaryoları passed
3. ✅ Error handling çalışıyor
4. ✅ Loading states gösteriliyor

**Sonraki Adım:** Production deployment!

---

**💡 İpucu:** Bu dokümantasyonu ekibinizle paylaşın ve entegrasyon sırasında referans olarak kullanın.

---

*Son Güncelleme: 2025-12-27*
