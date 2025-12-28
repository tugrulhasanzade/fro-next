# 👋 Backend Takımı - Buradan Başlayın!

> **Acil Bilgi:** Frontend tamamen hazır. API entegrasyonu için yapmanız gerekenler aşağıda.

---

## 🚀 Hızlı Başlangıç (5 Dakikada Anlayın)

### 1. Ne Teslim Ediliyor?

✅ **Tamamen çalışan frontend**
- Modern UI/UX (glassmorphism, dark mode, animasyonlar)
- Trendyol ve Hepsiburada ürün yönetimi
- Kapanır-açılır sidebar menü
- Ürün detay modal'ı (7 farklı tab)
- Filtre sistemi
- Responsive tasarım

❌ **Backend API bağlantısı YOK**
- Mock data ile çalışıyor
- Sizin API'lerinizi bağlamanız gerekiyor

---

## 📚 Hangi Dosyayı Okumalısınız?

### Başlangıç Seviyesi (Mutlaka Okuyun)

1. **[HANDOFF.md](HANDOFF.md)** ⭐ EN ÖNEMLİ
   - API'leri nereye bağlayacağınız (3 nokta)
   - Örnek kodlar
   - Request/Response formatları
   - Checklist

### Orta Seviye

2. **[README.md](README.md)**
   - Proje kurulumu
   - Komutlar
   - Genel bakış

3. **[ARCHITECTURE.md](ARCHITECTURE.md)**
   - Detaylı mimari
   - Bileşen yapısı
   - Veri akışı

---

## ⚡ Yapılması Gerekenler (Özet)

### 1. API Endpoint'leri Oluşturun

```
GET  /api/products?platform={trendyol|hepsiburada}
POST /api/products/refresh?platform={trendyol|hepsiburada}
PUT  /api/products/:id
```

### 2. Frontend'de 3 Noktayı Güncelleyin

| Nokta | Dosya | Satır | Ne Yapılacak |
|-------|-------|-------|--------------|
| 1 | `app/page.tsx` | 44-46 | Mock data yerine API call |
| 2 | `app/page.tsx` | 89-92 | Refresh button'a API ekle |
| 3 | `components/ProductManageModal.tsx` | Footer | Save button'a API ekle |

**Detaylı kodlar için:** [HANDOFF.md](HANDOFF.md)

### 3. Type Definitions

Backend response'larınız şu tiplere uygun olmalı:
- `TrendyolProduct` interface
- `HepsiburadaProduct` interface

**Tam tanımlar:** `lib/types/index.ts`

---

## 🎯 Kritik Bilgiler

### Mock Data Nerede?
```
lib/mockData.ts
```
Bu dosyayı silebilir veya tutabilirsiniz. Önemli değil.

### Type Definitions Nerede?
```
lib/types/index.ts
```
Backend response'larınız **TAM OLARAK** bu tiplere uymalı!

### Entegrasyon Noktaları
```
app/page.tsx → Satır 44-46, 89-92
components/ProductManageModal.tsx → Footer (Save button)
```

---

## 📋 Checklist (Hızlı)

Backend ekibinin yapması gerekenler:

- [ ] 3 API endpoint'i hazırla
- [ ] Response format'ı `lib/types/index.ts`'e uygun yap
- [ ] `app/page.tsx` içinde mock data yerine API call
- [ ] Loading ve error state'leri ekle
- [ ] Test et (Postman/Insomnia)
- [ ] Frontend'i çalıştır ve test et
- [ ] Production'a deploy

**Tahmini Süre:** 2-4 saat

---

## 🧪 Nasıl Test Edersiniz?

### 1. Projeyi Çalıştırın
```bash
cd turkwise-admin
npm install
npm run dev
```

### 2. Tarayıcıda Açın
```
http://localhost:3011
```

### 3. Test Senaryoları
- ✅ Sayfa açılıyor mu?
- ✅ Trendyol tab'i çalışıyor mu?
- ✅ Hepsiburada tab'i çalışıyor mu?
- ✅ Filtreler çalışıyor mu?
- ✅ Modal açılıyor mu?
- ✅ Dark mode çalışıyor mu?

---

## 🆘 Sorun Çözme

### "Type hatası alıyorum"
→ Backend response'unuz `lib/types/index.ts`'e uygun değil. Mapper yazın.

### "CORS hatası alıyorum"
→ Backend'de CORS ayarlarını yapın.

### "401 Unauthorized"
→ Authorization header'ı doğru mu? NextAuth token'ı kullanın.

### "Mock data gösteriliyor"
→ API call'ları doğru yapmadınız. [HANDOFF.md](HANDOFF.md) dosyasına bakın.

---

## 📞 İletişim

Sorularınız için:
- **Frontend Lead:** [İsim/Email]
- **Slack:** #frontend-backend-integration

---

## 🎉 Başarılar!

Bu proje çok temiz hazırlandı. Entegrasyon çok kolay olacak.

**Sonraki Adım:** [HANDOFF.md](HANDOFF.md) dosyasını açın ve adım adım ilerleyin.

---

**💡 İpucu:** Bu 4 dosyayı sırayla okuyun:
1. ✅ BACKEND_TAKIMI_OKUNSUN.md (bu dosya - genel bakış)
2. 📖 HANDOFF.md (entegrasyon rehberi)
3. 📖 README.md (proje bilgileri)
4. 📖 ARCHITECTURE.md (detaylı mimari)

---

*Hazırlayan: Frontend Team | Tarih: 2025-12-27*
