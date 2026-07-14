// Tipagem global para evitar erros do TypeScript ao usar bibliotecas de terceiros no window
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    ttq?: { page: () => void; track: (...args: any[]) => void };
    dataLayer?: any[];
  }
}

export type EventName = 
  | "ViewContent" 
  | "AddToCart" 
  | "InitiateCheckout" 
  | "AddPaymentInfo" 
  | "Purchase" 
  | "Lead";

export interface EventPayload {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_type?: "product" | "product_group";
  num_items?: number;
  search_string?: string;
}

export const pageView = (url: string) => {
  if (typeof window === "undefined") return;

  // Dispara pageview no Meta
  if (window.fbq) window.fbq("track", "PageView");
  
  // Dispara pageview no TikTok
  if (window.ttq) window.ttq.page();
  
  // Dispara evento pro GTM/GA4
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "page_view",
      page_path: url,
    });
  }
};

export const trackEvent = (eventName: EventName, payload: EventPayload = {}) => {
  if (typeof window === "undefined") return;

  const defaultPayload = { currency: "BRL", ...payload };

  // Rastreamento Meta (Facebook)
  if (window.fbq) {
    window.fbq("track", eventName, defaultPayload);
  }

  // Rastreamento TikTok
  if (window.ttq) {
    window.ttq.track(eventName, defaultPayload);
  }

  // Rastreamento GTM/GA4 (Ecommerce DataLayer padrão)
  if (window.dataLayer) {
    window.dataLayer.push({ ecommerce: null }); // Limpa o objeto anterior
    window.dataLayer.push({
      event: eventName.toLowerCase(),
      ecommerce: defaultPayload,
    });
  }
};