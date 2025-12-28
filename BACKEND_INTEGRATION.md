# 🔌 Backend Entegrasyon Rehberi - AI Metin Düzenleme

Bu doküman, frontend'in AI metin düzenleme özelliği için backend API gereksinimlerini açıklar.

## 📋 Genel Bakış

Frontend, ürün başlıkları ve açıklamaları için AI destekli metin düzenleme özelliğine sahiptir. Bu özellik backend API endpoint'i beklemektedir.

## 🛠️ Backend API Gereksinimleri

### Endpoint

```
POST /api/ai/enhance-text
```

### Request Body

```typescript
{
  "text": string,              // Düzenlenecek metin
  "type": "title" | "description",  // Metin tipi
  "platform": "trendyol" | "hepsiburada",  // Platform
  "tenantId"?: string          // (Opsiyonel) Multi-tenant desteği için
}
```

### Response Body (Başarılı - 200 OK)

```typescript
{
  "enhancedText": string,      // AI tarafından düzenlenmiş metin
  "originalLength": number,    // Orijinal metnin karakter sayısı
  "enhancedLength": number,    // Düzenlenmiş metnin karakter sayısı
  "confidence"?: number,       // (Opsiyonel) AI güven skoru (0-1)
  "suggestions"?: string[]     // (Opsiyonel) Alternatif öneriler
}
```

### Response Body (Hata - 4xx/5xx)

```typescript
{
  "message": string,           // Hata mesajı
  "code"?: string,             // Hata kodu
  "details"?: any              // Ek hata detayları
}
```

## 🎯 Örnek Request/Response

### Request Örneği (Başlık)

```bash
curl -X POST http://localhost:3000/api/ai/enhance-text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Erkek Tişört Siyah",
    "type": "title",
    "platform": "trendyol"
  }'
```

### Response Örneği (Başarılı)

```json
{
  "enhancedText": "Erkek Basic Pamuklu Siyah Tişört - Slim Fit Casual Üst Giyim",
  "originalLength": 19,
  "enhancedLength": 62,
  "confidence": 0.95
}
```

### Request Örneği (Açıklama)

```bash
curl -X POST http://localhost:3000/api/ai/enhance-text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Pamuklu tişört. Rahat kesim.",
    "type": "description",
    "platform": "hepsiburada"
  }'
```

### Response Örneği (Başarılı)

```json
{
  "enhancedText": "Yüksek kaliteli %100 pamuklu kumaştan üretilen bu tişört, günlük kullanım için ideal bir seçimdir. Rahat kesimi sayesinde tüm gün konforlu bir kullanım deneyimi sunar. Nefes alabilen yapısı ile her mevsim rahatlıkla giyilebilir.",
  "originalLength": 30,
  "enhancedLength": 215,
  "confidence": 0.92,
  "suggestions": [
    "Premium %100 pamuk kumaş kullanımı",
    "Rahat ve ferah kesim",
    "Her mevsim kullanıma uygun"
  ]
}
```

### Response Örneği (Hata)

```json
{
  "message": "AI servisi şu anda kullanılamıyor",
  "code": "AI_SERVICE_UNAVAILABLE",
  "details": {
    "provider": "openai",
    "error": "Rate limit exceeded"
  }
}
```

## 🔐 Güvenlik Notları

1. **API Key Yönetimi**
   - AI provider API key'leri **SADECE BACKEND**'de tutulmalıdır
   - Asla frontend'e veya client-side kod içine eklenmemelidir
   - `.env` dosyasında saklayın ve `.gitignore`'a ekleyin

   ```env
   # .env
   OPENAI_API_KEY=sk-xxx...
   # veya
   ANTHROPIC_API_KEY=sk-ant-xxx...
   ```

2. **Rate Limiting**
   - Tenant bazlı rate limiting uygulayın (örn: günlük 100 istek/tenant)
   - Kötüye kullanımı önlemek için IP bazlı throttling ekleyin

3. **Authentication**
   - İsteğe bağlı: JWT token veya API key ile authentication ekleyebilirsiniz
   - Frontend'den gelen istekleri doğrulayın

## 🏗️ Backend Implementation Önerileri

### 1. Node.js/Express Örneği

```typescript
import express from 'express';
import OpenAI from 'openai';

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/ai/enhance-text', async (req, res) => {
  try {
    const { text, type, platform } = req.body;

    // Validasyon
    if (!text || !type || !platform) {
      return res.status(400).json({
        message: 'Eksik parametreler',
        code: 'MISSING_PARAMETERS',
      });
    }

    // AI Prompt oluştur
    const prompt = type === 'title'
      ? `E-ticaret ürün başlığını SEO uyumlu şekilde iyileştir. Platform: ${platform}. Başlık: ${text}`
      : `E-ticaret ürün açıklamasını detaylandır ve satış odaklı yap. Platform: ${platform}. Açıklama: ${text}`;

    // OpenAI API çağrısı
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Sen e-ticaret platformları için ürün metinleri yazan profesyonel bir copywriter\'sın.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: type === 'title' ? 100 : 500,
    });

    const enhancedText = completion.choices[0].message.content || text;

    // Response
    res.json({
      enhancedText,
      originalLength: text.length,
      enhancedLength: enhancedText.length,
      confidence: 0.9,
    });
  } catch (error: any) {
    console.error('AI Enhancement Error:', error);

    res.status(500).json({
      message: 'AI düzenleme başarısız oldu',
      code: 'AI_SERVICE_ERROR',
      details: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
```

### 2. Python/FastAPI Örneği

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os

app = FastAPI()
openai.api_key = os.getenv("OPENAI_API_KEY")

class EnhanceRequest(BaseModel):
    text: str
    type: str  # "title" | "description"
    platform: str  # "trendyol" | "hepsiburada"

class EnhanceResponse(BaseModel):
    enhancedText: str
    originalLength: int
    enhancedLength: int
    confidence: float = 0.9

@app.post("/api/ai/enhance-text", response_model=EnhanceResponse)
async def enhance_text(request: EnhanceRequest):
    try:
        prompt = (
            f"E-ticaret ürün {'başlığını' if request.type == 'title' else 'açıklamasını'} "
            f"SEO uyumlu şekilde iyileştir. Platform: {request.platform}. "
            f"Metin: {request.text}"
        )

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Sen e-ticaret için copywriter'sın."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=100 if request.type == "title" else 500
        )

        enhanced_text = response.choices[0].message.content

        return EnhanceResponse(
            enhancedText=enhanced_text,
            originalLength=len(request.text),
            enhancedLength=len(enhanced_text),
            confidence=0.9
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "AI düzenleme başarısız oldu",
                "code": "AI_SERVICE_ERROR",
                "details": str(e)
            }
        )
```

## 🎨 Platform Özel Optimizasyonlar

### Trendyol İçin
- Başlık: Max 100 karakter
- Açıklama: Max 5000 karakter
- Marka adı ve kategori bilgisi eklenebilir

### Hepsiburada İçin
- Başlık: Max 150 karakter
- Açıklama: Max 3000 karakter
- Teknik özellikler vurgulanabilir

## 🧪 Test Etme

Frontend hazır ve bekliyor! Backend'inizi şu şekilde test edebilirsiniz:

1. Backend'inizi çalıştırın (örn: `http://localhost:3000`)
2. `.env.local` dosyası oluşturun:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
3. Frontend'i çalıştırın: `npm run dev`
4. Bir ürünü açın ve AI düzenleme butonlarına tıklayın

## 📊 Frontend'in Beklentileri

Frontend şu senaryolara hazırdır:

✅ **Başarılı yanıt (200)**: Toast ile başarı mesajı, input otomatik güncellenir
✅ **Network hatası**: "Backend bağlantısı kurulamadı" uyarısı
✅ **HTTP hataları (4xx/5xx)**: Backend'den gelen hata mesajı gösterilir
✅ **Loading durumu**: Buton disabled olur, animasyon gösterilir

## 🚀 İleriye Dönük Özellikler

Gelecekte eklenebilecek özellikler:

- **Caching**: Aynı metin için tekrar AI'ya gitmeden cache'den dön
- **Batch işlemler**: Birden fazla ürün için toplu düzenleme
- **Alternatif öneriler**: Kullanıcı birden fazla AI önerisi arasından seçebilir
- **A/B testing**: Hangi AI prompt'larının daha iyi çalıştığını test et
- **Çoklu dil desteği**: Farklı dillerde ürün açıklamaları

## 📞 Destek

Sorularınız için:
- Frontend kodu: `/Users/aslihansen/Downloads/turkwise-admin/lib/services/aiService.ts`
- Modal komponenti: `/Users/aslihansen/Downloads/turkwise-admin/components/ProductManageModal.tsx`

---

**Not**: Bu entegrasyon tamamen backend-first yaklaşımla tasarlanmıştır. Frontend hazır ve bekliyor, backend ekibi yukarıdaki spesifikasyonlara uygun API'yi implement ettiğinde sistem otomatik olarak çalışacaktır! 🎉
