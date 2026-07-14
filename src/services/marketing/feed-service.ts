import { prisma } from "@/lib/prisma/client";
import { ProductStatus } from "@prisma/client";

const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || "https://trendrushx.com";

export class FeedService {
  /**
   * Escapa caracteres especiais para evitar quebra do XML
   */
  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  /**
   * Gera o XML no padrão Google Merchant Center (RSS 2.0)
   * Aceito nativamente pelo Facebook Commerce Manager e TikTok Catalog.
   */
  async generateGoogleMerchantFeed(): Promise<string> {
    // Busca produtos ativos com suas variantes primárias e imagens
    const products = await prisma.product.findMany({
      where: { 
        status: ProductStatus.ACTIVE 
      },
      include: {
        variants: {
          take: 1, // Para simplificar o feed principal, pegamos a variante base
          orderBy: { price: 'asc' }
        },
        images: {
          take: 1,
          orderBy: { order: 'asc' }
        },
        category: true
      }
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>TRENDRUSH X</title>
    <link>${STORE_URL}</link>
    <description>A Plataforma Definitiva de Produtos Virais</description>
`;

    for (const product of products) {
      if (product.variants.length === 0 || product.images.length === 0) continue;

      const variant = product.variants[0];
      const image = product.images[0];
      const productLink = `${STORE_URL}/product/${product.slug}`;
      
      // Regra de Estoque para as plataformas de Ads
      const availability = variant.inventory > 0 || variant.inventory === -1 ? "in_stock" : "out_of_stock";

      xml += `    <item>
      <g:id>${variant.sku}</g:id>
      <g:title>${this.escapeXml(product.name)}</g:title>
      <g:description>${this.escapeXml(product.shortDescription || product.name)}</g:description>
      <g:link>${this.escapeXml(productLink)}</g:link>
      <g:image_link>${this.escapeXml(image.url)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${variant.price.toFixed(2)} BRL</g:price>
      ${variant.compareAtPrice && variant.compareAtPrice > variant.price 
        ? `<g:sale_price>${variant.price.toFixed(2)} BRL</g:sale_price>` 
        : ''}
      <g:brand>TRENDRUSH X</g:brand>
      <g:product_type>${this.escapeXml(product.category.name)}</g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
    </item>
`;
    }

    xml += `  </channel>
</rss>`;

    return xml;
  }
}

export const feedService = new FeedService();