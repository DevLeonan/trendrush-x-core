import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_STORE_URL || "https://trendrushx.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/checkout/",
        "/api/",
        "/carrinho/",
        "/*?*utm_*", // Evita indexar URLs com parâmetros de rastreamento de Ads
        "/*?*session_*", 
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}