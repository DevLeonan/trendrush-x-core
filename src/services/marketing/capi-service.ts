import { logger } from "@/lib/logger";

interface CapiEventPayload {
  eventName: "Purchase" | "InitiateCheckout" | "AddToCart";
  eventTime: number; // UNIX timestamp em segundos
  eventId: string;   // Crucial para desduplicação (mesmo ID enviado pelo Browser)
  sourceUrl: string;
  userData: {
    email?: string;
    phone?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbp?: string; // Cookie _fbp do Facebook
    fbc?: string; // Cookie _fbc do Facebook (Click ID)
  };
  customData: {
    value: number;
    currency: string;
    contentIds: string[];
  };
}

export class FacebookCapiService {
  private pixelId = process.env.META_PIXEL_ID;
  private accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  private apiVersion = "v18.0";

  /**
   * Criptografa dados sensíveis (E-mail/Telefone) em SHA-256 conforme exigência estrita do Meta.
   */
  private async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Envia o evento Server-to-Server para o Facebook Graph API.
   */
  async sendEvent(payload: CapiEventPayload) {
    if (!this.pixelId || !this.accessToken) {
      logger.warn({ message: "Meta CAPI não configurada. Faltam variáveis de ambiente." });
      return;
    }

    try {
      const hashedEmail = payload.userData.email ? await this.hashData(payload.userData.email) : undefined;
      const hashedPhone = payload.userData.phone ? await this.hashData(payload.userData.phone) : undefined;

      const eventData = {
        data: [
          {
            event_name: payload.eventName,
            event_time: payload.eventTime,
            event_id: payload.eventId,
            event_source_url: payload.sourceUrl,
            action_source: "website",
            user_data: {
              em: hashedEmail ? [hashedEmail] : undefined,
              ph: hashedPhone ? [hashedPhone] : undefined,
              client_ip_address: payload.userData.clientIpAddress,
              client_user_agent: payload.userData.clientUserAgent,
              fbp: payload.userData.fbp,
              fbc: payload.userData.fbc,
            },
            custom_data: {
              value: payload.customData.value,
              currency: payload.customData.currency,
              content_ids: payload.customData.contentIds,
              content_type: "product",
            },
          },
        ],
      };

      const url = `https://graph.facebook.com/${this.apiVersion}/${this.pixelId}/events?access_token=${this.accessToken}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(result));
      }

      logger.info({ message: `Evento CAPI ${payload.eventName} enviado com sucesso`, context: { eventId: payload.eventId } });
      
    } catch (error) {
      logger.error({ message: "Falha ao enviar evento via Facebook CAPI", error, context: { eventId: payload.eventId } });
    }
  }
}

export const facebookCapiService = new FacebookCapiService();