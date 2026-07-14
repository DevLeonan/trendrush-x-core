import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma/client";
import { ProductStatus } from "@prisma/client";

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_STORE_URL || "https://trendrushx.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Rotas Estáticas Base
  const routes = ["", "/faq", "/contato", "/termos", "/privacidade"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.5,
  }));

  try {
    // 1. Mapear Categorias Dinâmicas
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const categoryRoutes = categories.map((category) => ({
      url: `${SITE_URL}/categoria/${category.slug}`,
      lastModified: category.updatedAt.toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    // 2. Mapear Produtos Ativos
    const products = await prisma.product.findMany({
      where: { status: ProductStatus.ACTIVE },
      select: { slug: true, updatedAt: true },
    });

    const productRoutes = products.map((product) => ({
      url: `${SITE_URL}/product/${product.slug}`,
      lastModified: product.updatedAt.toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

    return [...routes, ...categoryRoutes, ...productRoutes];
  } catch (error) {
    // Fallback seguro em caso de falha de banco no momento da geração
    console.error("Erro ao gerar Sitemap:", error);
    return routes;
  }
}