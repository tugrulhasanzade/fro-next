# 🏗️ Turkwise Admin - Ürün Yönetim Paneli Mimari Dokümantasyonu

> **Son Güncelleme:** 2025-12-27
> **Framework:** Next.js 14.1.0 (App Router)
> **Dil:** TypeScript
> **Amaç:** Trendyol ve Hepsiburada pazaryeri ürün yönetimi

---

## 📋 Proje Özeti

Bu proje, Turkwise ekosisteminin bir parçası olarak **Trendyol** ve **Hepsiburada** pazaryerlerindeki ürünlerin yönetimi için geliştirilmiş bir admin paneli frontend'idir.

**Önemli:** Bu proje **sadece frontend**'dir. Backend API entegrasyonu, backend ekibi tarafından yapılacaktır.

---

## 📁 Proje Yapısı

```
turkwise-admin/
├── 📁 app/                      # Next.js App Router
│   ├── 📄 layout.tsx            # Root layout
│   ├── 📄 page.tsx              # Ana ürün kataloğu sayfası
│   └── 📄 globals.css           # Global CSS ve Tailwind
│
├── 📁 components/               # React Bileşenleri
│   ├── 📄 Header.tsx            # (Kullanılmıyor - Legacy)
│   ├── 📄 Logo.tsx              # Turkwise logosu
│   ├── 📄 Sidebar.tsx           # Kapanır-açılır sidebar menü
│   ├── 📄 ProductCard.tsx       # Ürün kartı bileşeni
│   └── 📄 ProductManageModal.tsx # Ürün detay/düzenleme modal'ı
│
├── 📁 lib/                      # Kütüphaneler ve Yardımcılar
│   ├── 📄 mockData.ts           # Mock ürün verileri (GEÇİCİ)
│   └── 📁 types/
│       └── 📄 index.ts          # TypeScript tip tanımları
│
├── 📁 public/                   # Statik dosyalar
│
├── 📄 package.json              # Proje bağımlılıkları
├── 📄 tsconfig.json             # TypeScript yapılandırması
├── 📄 tailwind.config.ts        # Tailwind CSS yapılandırması
├── 📄 postcss.config.mjs        # PostCSS yapılandırması
├── 📄 next.config.mjs           # Next.js yapılandırması
│
├── 📄 ARCHITECTURE.md           # Bu dosya
├── 📄 README.md                 # Proje kurulum rehberi
└── 📄 HANDOFF.md                # Backend entegrasyon rehberi
```

---

## 🎯 Ana Özellikler

### 1. Multi-Platform Ürün Yönetimi
- **Trendyol** ürünleri
- **Hepsiburada** ürünleri
- Platform seçimi ile dinamik içerik

### 2. Filtre Sistemi

#### Trendyol Filtreleri:
- Barkod, Stok Kodu, Ürün ID, Ürün Adı ile arama
- Durum filtreleme (Onaylandı, Arşiv, Satışta, Reddedildi, Kara Liste)
- Tarih tipi seçimi (Oluşturma/Güncelleme)
- Tarih aralığı seçimi

#### Hepsiburada Filtreleri:
- Hepsiburada SKU veya Satıcı SKU ile arama
- Listeleme durumu (Satışta/Satışta Değil)
- Tarih aralığı seçimi

### 3. Kapanır-Açılır Sidebar Menü
- Hamburger ikonu ile açılır/kapanır
- Blur overlay ile modern UX
- Dark/Light mode toggle
- Profil linki
- Pazaryeri işlemleri dropdown menüsü
- Smooth animasyonlar

### 4. Ürün Detay Modal'ı
- **7 Tab Yapısı:**
  1. **Genel:** Başlık, barkod, marka, kategori, açıklama (AI optimizasyon UI)
  2. **Fiyat:** Stok, liste fiyatı, satış fiyatı, KDV
  3. **Medya:** Ürün görselleri
  4. **Lojistik:** Kargo firması, teslimat süresi
  5. **Durum:** Onay durumu, batch bilgileri
  6. **Varyantlar:** (Sadece Hepsiburada)
  7. Platform özel bilgiler

### 5. Dark/Light Mode
- LocalStorage ile persist
- System preference detection
- Smooth geçişler

### 6. Glassmorphism Tasarım
- Modern blur efektleri
- Transparent kartlar
- Hover animasyonları

---

## 🧩 Bileşen Mimarisi

### Bileşen Hiyerarşisi

```
app/layout.tsx (Root)
  └── app/page.tsx (Ana Sayfa)
      ├── Sidebar.tsx
      │   ├── Logo.tsx
      │   └── Navigation Menu
      │
      ├── Platform Tabs (Trendyol / Hepsiburada)
      ├── Filter Section
      │   ├── Search Input
      │   ├── Status Filters
      │   └── Date Range Filters
      │
      ├── Products Grid
      │   └── ProductCard.tsx (×N)
      │       ├── Platform Badge
      │       ├── Status Badge
      │       ├── Product Image
      │       ├── Price/Stock Info
      │       └── Manage Button
      │
      └── ProductManageModal.tsx
          ├── Header (Title, Barcode, Platform)
          ├── Tabs (General, Price, Media, Logistics, Status, Variants)
          ├── Tab Content
          └── Footer (Cancel, Save Buttons)
```

---

## 📊 Veri Akışı

### Mevcut Akış (Mock Data)

```
┌─────────────────────────────────────────────────────────────────┐
│                         KULLANICI                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      app/page.tsx                                │
│  • Platform seçimi (Trendyol/Hepsiburada)                        │
│  • Filter state yönetimi                                         │
│  • Theme yönetimi                                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      lib/mockData.ts                             │
│  • MOCK_TRENDYOL_PRODUCTS                                        │
│  • MOCK_HEPSIBURADA_PRODUCTS                                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Filtreleme İşlemi                              │
│  (app/page.tsx içinde - satır 49-82)                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   ProductCard Render                             │
│  • Her ürün için bir kart                                        │
│  • Platform özel bilgiler                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Hedef Akış (Backend Entegrasyonu Sonrası)

```
┌─────────────────────────────────────────────────────────────────┐
│                         KULLANICI                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      app/page.tsx                                │
│  • useEffect ile sayfa yüklendiğinde API çağrısı                 │
│  • Loading state                                                 │
│  • Error handling                                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              Backend API Service (Eklenecek)                     │
│  • GET /api/products?platform=trendyol                           │
│  • GET /api/products?platform=hepsiburada                        │
│  • PUT /api/products/:id                                         │
│  • POST /api/products/refresh                                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   TURKWISE BACKEND API                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 TypeScript Tip Tanımları

### Platform Types

```typescript
export type Platform = 'trendyol' | 'hepsiburada';
export type ProductStatus = 'active' | 'pending' | 'rejected' | 'draft';
```

### Trendyol Product Interface

Detaylı yapı için: [lib/types/index.ts:21-56](lib/types/index.ts#L21-L56)

**Temel Alanlar:**
- `id`, `barcode`, `title`, `stockCode`
- `brandId`, `brandName`, `categoryId`, `categoryName`
- `quantity`, `salePrice`, `listPrice`, `vatRate`
- `images[]`, `attributes[]`
- `approved`, `archived`, `onSale`, `rejected`, `blacklisted`
- `batchRequestId`, `batchStatus`, `failureReasons[]`

### Hepsiburada Product Interface

Detaylı yapı için: [lib/types/index.ts:59-83](lib/types/index.ts#L59-L83)

**Temel Alanlar:**
- `id`, `barcode`, `title`
- `hepsiburadaSku`, `merchantSku`
- `price`, `availableStock`, `dispatchTime`
- `cargoCompany1`, `cargoCompany2`, `cargoCompany3`
- `inventoryUploadId`, `uploadStatus`
- `errorMessage`, `errorDetails`
- `listingStatus` (active/inactive)

---

## 🎨 Stil Sistemi

### Tailwind CSS Yapılandırması

**Font Aileleri:**
- `font-display`: Outfit (başlıklar için)
- `font-sans`: Inter (genel metin)

**Custom Utilities:**

```css
.glass-card {
  @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 shadow-xl;
}

.glass-shine {
  position: relative;
  overflow: hidden;
  &::before {
    /* Shine animasyonu */
  }
}

.custom-scrollbar {
  /* Özel scrollbar */
}
```

**Tema Renkleri:**
- **Trendyol:** Orange → Purple gradient
- **Hepsiburada:** Orange → Red gradient
- **Primary:** Indigo → Purple gradient

---

## 🔌 Backend Entegrasyon Noktaları

### 1. Ürün Listesi Çekme

**Dosya:** [app/page.tsx:44-46](app/page.tsx#L44-L46)

```typescript
// ŞU AN:
const allProducts = selectedPlatform === 'trendyol'
  ? MOCK_TRENDYOL_PRODUCTS
  : MOCK_HEPSIBURADA_PRODUCTS;

// BACKEND ENTEGRASYONUNDAN SONRA:
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    const response = await fetch(`/api/products?platform=${selectedPlatform}`);
    const data = await response.json();
    setProducts(data);
    setLoading(false);
  };
  fetchProducts();
}, [selectedPlatform]);
```

### 2. Listeyi Yenile Butonu

**Dosya:** [app/page.tsx:89-92](app/page.tsx#L89-L92)

```typescript
// ŞU AN:
const handleRefresh = () => {
  console.log(`Refreshing ${selectedPlatform} products...`);
  // Backend API call buraya gelecek
};

// BACKEND ENTEGRASYONUNDAN SONRA:
const handleRefresh = async () => {
  setLoading(true);
  await fetch(`/api/products/refresh?platform=${selectedPlatform}`, {
    method: 'POST'
  });
  // Listeyi yeniden çek
  await fetchProducts();
  setLoading(false);
};
```

### 3. Ürün Güncelleme (Modal'dan)

**Dosya:** `components/ProductManageModal.tsx` (Footer kısmı)

```typescript
// BACKEND ENTEGRASYONUNDAN SONRA:
const handleSave = async () => {
  await fetch(`/api/products/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProduct)
  });
  onClose();
  // Parent component'te listeyi yenile
};
```

---

## 🔒 Auth & Routing

### Mevcut Durum
Bu proje **standalone** bir sayfa olarak tasarlanmıştır. Authentication, turkwise ana projesinde (`turkwise-fe-web`) yönetilmektedir.

### Entegrasyon Sonrası
Bu sayfa, turkwise ana projesinin içinde şu route altında olacaktır:
```
/panel/marketplace-products
```

veya

```
/panel/product-catalog
```

**NextAuth** ile korunan bir route olacak ve giriş yapmış kullanıcılar erişebilecek.

---

## 📦 Bağımlılıklar

### Production Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "next": "14.1.0",
  "lucide-react": "^0.344.0"
}
```

### Dev Dependencies
```json
{
  "typescript": "^5.3.3",
  "@types/node": "^20.11.5",
  "@types/react": "^18.2.48",
  "@types/react-dom": "^18.2.18",
  "autoprefixer": "^10.4.17",
  "postcss": "^8.4.33",
  "tailwindcss": "^3.4.1"
}
```

**Not:** Ana projeye entegre edildiğinde, ana projenin bağımlılıkları kullanılacaktır.

---

## 🚀 Development

### Başlatma
```bash
npm install
npm run dev
```

Port: `http://localhost:3011`

### Build
```bash
npm run build
npm start
```

---

## 📚 Backend Ekibi İçin Notlar

1. **Mock Data Lokasyonu:** [lib/mockData.ts](lib/mockData.ts)
2. **Type Definitions:** [lib/types/index.ts](lib/types/index.ts)
3. **API Entegrasyon Noktaları:** [HANDOFF.md](HANDOFF.md) dosyasına bakın
4. **Bileşen Yapısı:** Tüm bileşenler `components/` klasöründe
5. **State Yönetimi:** Şu an sadece React `useState` kullanılıyor
6. **Error Handling:** Backend tarafından eklenecek

---

## 🏗️ Ana Projeye Entegrasyon Planı

### 1. Dosya Taşıma
```
turkwise-admin/components/*
  → turkwise-fe-web/src/app/(panel)/panel/products/components/

turkwise-admin/lib/types/index.ts
  → turkwise-fe-web/src/types/products.types.ts

turkwise-admin/app/page.tsx
  → turkwise-fe-web/src/app/(panel)/panel/products/page.tsx
```

### 2. Provider Entegrasyonu
Ana projedeki provider'lar otomatik olarak bu sayfayı saracaktır:
- `ThemeProvider`
- `QueryProvider` (React Query)
- `NextAuthProvider`
- `ReduxProvider`

### 3. Servis Katmanı Ekleme
```
turkwise-fe-web/src/services/api/product.service.ts
```

### 4. Layout Entegrasyonu
Ana projenin `PanelLayout` kullanılacak, mevcut `Sidebar` component'i ile birleştirilecek.

---

## 📊 Performans Notları

- **Bundle Size:** ~200KB (minified + gzipped)
- **İlk Yüklenme:** <1s (localhost)
- **Hydration:** Next.js App Router otomatik optimizasyon
- **Images:** Lazy loading (Next.js Image component kullanılabilir)

---

## 🐛 Bilinen Sınırlamalar

1. **Mock Data:** Gerçek API yerine statik mock data kullanılıyor
2. **Auth Yok:** Authentication backend entegrasyonunda eklenecek
3. **Error States:** Henüz error boundary veya fallback UI yok
4. **Loading States:** Skeleton loader eklenebilir
5. **Pagination:** Yok (tüm ürünler client-side render)
6. **Optimistic Updates:** Yok
7. **Real-time Sync:** Yok

---

## 🔮 Gelecek Geliştirmeler (Opsiyonel)

- [ ] React Query ile server state yönetimi
- [ ] Infinite scroll veya pagination
- [ ] Skeleton loader'lar
- [ ] Error boundary
- [ ] Optimistic UI updates
- [ ] Real-time data sync (WebSocket?)
- [ ] Export to Excel/CSV
- [ ] Bulk operations (toplu güncelleme)
- [ ] Advanced filtering (multi-select, range sliders)
- [ ] Product comparison
- [ ] Activity logs

---

## 📞 İletişim

**Proje Sahibi:** Turkwise Frontend Team
**Backend Entegrasyon:** Backend Team

---

*Bu dokümantasyon, backend ekibinin frontend kodunu anlaması ve API entegrasyonunu sorunsuz yapabilmesi için hazırlanmıştır.*
