/**
 * TRENDRUSH X - Enterprise Sanitizer
 * Remove tags HTML e caracteres de controle perigosos de strings.
 */
export const sanitizeInput = (input: string | undefined | null): string => {
  if (!input) return "";

  return input
    .trim()
    // Remove qualquer tag HTML/XML
    .replace(/<[^>]*>?/gm, "")
    // Remove caracteres de controle invisíveis (ASCII 0-31, exceto quebras de linha/tab)
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "")
    // Converte caracteres especiais em suas entidades seguras (opcional para exibição crua)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/**
 * Sanitiza recursivamente objetos aninhados (útil para payloads de API)
 */
export const sanitizePayload = <T>(payload: T): T => {
  if (typeof payload === "string") {
    return sanitizeInput(payload) as unknown as T;
  }

  if (Array.isArray(payload)) {
    return payload.map(sanitizePayload) as unknown as T;
  }

  if (payload !== null && typeof payload === "object") {
    const sanitizedObj: any = {};
    for (const [key, value] of Object.entries(payload)) {
      sanitizedObj[key] = sanitizePayload(value);
    }
    return sanitizedObj;
  }

  return payload;
};