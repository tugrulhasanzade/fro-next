/**
 * AI Text Enhancement Service
 *
 * Bu servis, backend API'nizle iletişim kurarak metin düzenleme işlemlerini yapar.
 * Backend'iniz hazır olduğunda direkt çalışacak şekilde yapılandırılmıştır.
 */

// API Base URL - .env dosyasından veya varsayılan değer
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface AIEnhanceRequest {
  text: string;
  type: 'title' | 'description';
  platform: 'trendyol' | 'hepsiburada';
  tenantId?: string; // Opsiyonel: Multi-tenant desteği için
}

export interface AIEnhanceResponse {
  enhancedText: string;
  originalLength: number;
  enhancedLength: number;
  confidence?: number; // Opsiyonel: AI güven skoru (0-1)
  suggestions?: string[]; // Opsiyonel: Alternatif öneriler
}

export interface AIServiceError {
  message: string;
  code: string;
  details?: any;
}

/**
 * Backend'e AI metin düzenleme isteği gönderir
 */
export async function enhanceText(
  request: AIEnhanceRequest
): Promise<AIEnhanceResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/enhance-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Backend authentication varsa eklenebilir:
        // 'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // HTTP hata durumları
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || 'AI düzenleme işlemi başarısız oldu',
        code: `HTTP_${response.status}`,
        details: errorData,
      } as AIServiceError;
    }

    const data: AIEnhanceResponse = await response.json();
    return data;
  } catch (error: any) {
    // Network hataları veya diğer hatalar
    if (error.code) {
      throw error; // Zaten AIServiceError formatında
    }

    // Genel hataları AIServiceError formatına çevir
    throw {
      message: error.message || 'Bağlantı hatası oluştu',
      code: 'NETWORK_ERROR',
      details: error,
    } as AIServiceError;
  }
}

/**
 * Başlık için özelleştirilmiş düzenleme
 */
export async function enhanceTitle(
  title: string,
  platform: 'trendyol' | 'hepsiburada'
): Promise<AIEnhanceResponse> {
  return enhanceText({
    text: title,
    type: 'title',
    platform,
  });
}

/**
 * Açıklama için özelleştirilmiş düzenleme
 */
export async function enhanceDescription(
  description: string,
  platform: 'trendyol' | 'hepsiburada'
): Promise<AIEnhanceResponse> {
  return enhanceText({
    text: description,
    type: 'description',
    platform,
  });
}
