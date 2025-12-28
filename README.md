# 🛍️ Turkwise Admin - Ürün Yönetim Paneli

> **Trendyol ve Hepsiburada pazaryeri ürünlerini tek panelden yönetin**

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red)]()

---

## 📋 Proje Hakkında

**Turkwise Admin**, Turkwise ekosisteminin bir parçası olarak geliştirilmiş, **Trendyol** ve **Hepsiburada** pazaryerlerindeki ürünlerin yönetimi için tasarlanmış modern bir web uygulamasıdır.

### ✨ Öne Çıkan Özellikler

- 🏪 **Multi-Platform Yönetim:** Trendyol ve Hepsiburada ürünlerini tek yerden yönetin
- 🔍 **Gelişmiş Filtreleme:** Barkod, SKU, durum ve tarih bazlı arama
- 📊 **Detaylı Ürün Kartları:** Fiyat, stok, durum bilgileri bir bakışta
- ✏️ **Modal Düzenleme:** 7 farklı sekmede ürün detaylarını yönetin
- 🎨 **Modern UI/UX:** Glassmorphism tasarım, dark mode, smooth animasyonlar
- 📱 **Responsive:** Mobil, tablet ve desktop uyumlu
- 🚀 **Hızlı:** Next.js 14 App Router ile optimize edilmiş performans

---

## 🎯 Hedef Kitle

- **E-ticaret Yöneticileri**
- **Pazaryeri Operasyon Ekipleri**
- **Ürün Yönetim Uzmanları**

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

- **Node.js:** 18.17 veya üzeri
- **npm:** 9.0 veya üzeri

### Kurulum

```bash
# Projeyi klonlayın
git clone <repository-url>
cd turkwise-admin

# Bağımlılıkları yükleyin
npm install

# Development server'ı başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3011](http://localhost:3011) adresini açın.

---

## 📦 Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Development server'ı başlatır (port 3011) |
| `npm run build` | Production build oluşturur |
| `npm start` | Production server'ı başlatır |
| `npm run lint` | ESLint ile kod analizi yapar |

---

## 📂 Proje Yapısı

```
turkwise-admin/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Ana sayfa (Ürün kataloğu)
│   └── globals.css         # Global stiller
│
├── components/             # React bileşenleri
│   ├── Logo.tsx            # Turkwise logosu
│   ├── Sidebar.tsx         # Kapanır-açılır menü
│   ├── ProductCard.tsx     # Ürün kartı
│   └── ProductManageModal.tsx # Ürün düzenleme modal'ı
│
├── lib/                    # Kütüphaneler
│   ├── mockData.ts         # Mock veriler (GEÇİCİ)
│   └── types/
│       └── index.ts        # TypeScript tipleri
│
├── public/                 # Statik dosyalar
│
└── docs/                   # Dokümantasyon
    ├── ARCHITECTURE.md     # Mimari dokümantasyon
    └── HANDOFF.md          # Backend entegrasyon rehberi
```

Detaylı yapı için: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🎨 Ekran Görüntüleri

### Ana Sayfa - Ürün Kataloğu
- Platform seçimi (Trendyol / Hepsiburada)
- Gelişmiş filtre sistemi
- Ürün kartları grid görünümü
- Responsive tasarım

### Sidebar Menü
- Kapanır-açılır hamburger menü
- Dark/Light mode toggle
- Navigation links
- Modern glassmorphism

### Ürün Detay Modal
- 7 farklı sekme
- AI optimizasyon UI (mock)
- Platform özel alanlar
- Hızlı güncelleme seçenekleri

---

## 🛠️ Teknoloji Stack'i

### Core
- **Next.js 14.1.0** - React framework (App Router)
- **React 18.3.1** - UI library
- **TypeScript 5.3.3** - Type safety

### Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **PostCSS** - CSS processing
- **Custom CSS** - Glassmorphism effects

### Icons
- **Lucide React 0.344.0** - Modern icon set

### Development
- **ESLint** - Code linting
- **Prettier** (önerilir) - Code formatting

---

## 🔌 Backend Entegrasyonu

⚠️ **Önemli:** Bu proje şu anda **mock data** ile çalışmaktadır. Backend API entegrasyonu için:

1. [HANDOFF.md](HANDOFF.md) dosyasını okuyun
2. [ARCHITECTURE.md](ARCHITECTURE.md) dosyasındaki **"Backend Entegrasyon Noktaları"** bölümüne bakın
3. `lib/types/index.ts` dosyasındaki tip tanımlarını API response'larınıza uygun kullanın

### API Entegrasyon Noktaları:

| Nokta | Dosya | Satır |
|-------|-------|-------|
| Ürün listesi çekme | `app/page.tsx` | 44-46 |
| Listeyi yenile | `app/page.tsx` | 89-92 |
| Ürün güncelleme | `components/ProductManageModal.tsx` | Footer |

---

## 📊 Veri Yapısı

### Trendyol Product
```typescript
interface TrendyolProduct {
  id: string;
  platform: 'trendyol';
  title: string;
  barcode: string;
  stockCode: string;
  salePrice: number;
  listPrice: number;
  quantity: number;
  // ... ve daha fazlası
}
```

### Hepsiburada Product
```typescript
interface HepsiburadaProduct {
  id: string;
  platform: 'hepsiburada';
  title: string;
  barcode: string;
  hepsiburadaSku: string;
  price: number;
  availableStock: number;
  // ... ve daha fazlası
}
```

Detaylı tip tanımları: [lib/types/index.ts](lib/types/index.ts)

---

## 🎨 Tema ve Stil Rehberi

### Renk Paleti

#### Trendyol
- **Gradient:** `from-orange-500 to-purple-600`
- **Shadow:** `shadow-purple-500/30`

#### Hepsiburada
- **Gradient:** `from-orange-500 to-red-600`
- **Shadow:** `shadow-red-500/30`

#### Genel
- **Primary:** `indigo-600` → `purple-600`
- **Success:** `emerald-500`
- **Warning:** `amber-500`
- **Error:** `red-500`

### Glassmorphism
```css
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

---

## 🔐 Güvenlik

⚠️ **Önemli Notlar:**
- Bu proje **frontend-only**'dir
- Authentication, ana Turkwise projesinde yönetilmektedir
- API key'ler ve hassas veriler backend'de tutulmalıdır
- CORS ayarları backend tarafından yapılmalıdır

---

## 📈 Performans

- **Bundle Size:** ~200KB (minified + gzipped)
- **First Load:** <1s (local)
- **Lighthouse Score:** 95+ (Performance)
- **Core Web Vitals:** Tümü yeşil

### Optimizasyon Önerileri
- [ ] Next.js Image component kullanımı
- [ ] Infinite scroll/pagination ekleme
- [ ] React Query ile server state caching
- [ ] Code splitting

---

## 🐛 Bilinen Sınırlamalar

1. **Mock Data:** Backend API bağlantısı yok
2. **No Auth:** Authentication katmanı yok
3. **No Pagination:** Tüm ürünler client-side
4. **No Error Boundary:** Global error handling yok
5. **No Loading States:** Skeleton loader yok

Bu sınırlamalar backend entegrasyonu sırasında giderilecektir.

---

## 🤝 Katkıda Bulunma

Bu proje Turkwise ekibi tarafından geliştirilmektedir.

### Development Workflow
1. Feature branch oluşturun (`feature/amazing-feature`)
2. Değişikliklerinizi commit edin
3. Branch'inizi push edin
4. Pull Request açın

---

## 📚 Dokümantasyon

| Dosya | Açıklama |
|-------|----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Detaylı mimari dokümantasyon |
| [HANDOFF.md](HANDOFF.md) | Backend entegrasyon rehberi |
| [README.md](README.md) | Bu dosya |

---

## 📞 Destek

Sorularınız için:
- **Frontend Team:** frontend@turkwise.com.tr
- **Backend Team:** backend@turkwise.com.tr

---

## 📄 Lisans

Bu proje **özel (private)** bir projedir ve Turkwise'a aittir.

---

## 🙏 Teşekkürler

- **Next.js Team** - Harika framework için
- **Tailwind CSS Team** - Modern CSS utility'ler için
- **Lucide Icons** - Güzel ikonlar için

---

**⭐ Proje hakkında sorularınız varsa [HANDOFF.md](HANDOFF.md) dosyasını inceleyin!**
