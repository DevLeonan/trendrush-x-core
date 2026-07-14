import { NextResponse } from "next/server";
import { feedService } from "@/services/marketing/feed-service";
import { logger } from "@/lib/logger";

// Forçamos o Next.js a sempre revalidar o feed, garantindo preços e estoques em tempo real
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const xmlFeed = await feedService.generateGoogleMerchantFeed();

    // Retorna o XML com os headers corretos para leitura automatizada pelos robôs de Ads
    return new NextResponse(xmlFeed, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate', // Cache de 1 hora na borda
      },
    });

  } catch (error) {
    logger.error({ message: "Falha ao gerar Feed de Catálogo XML", error });
    
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><error>Internal Server Error</error>', 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/xml' }
      }
    );
  }
}