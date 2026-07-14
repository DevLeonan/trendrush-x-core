import * as React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star, CheckCircle } from "lucide-react";
import { ProductGallery } from "@/components/store/product/product-gallery";
import { ProductActions } from "@/components/store/product/product-actions";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Mock de dados da API (Será substituído pelo Prisma na Etapa 17)
const getProductBySlug = async (slug: string) => {
  if (slug !== "smartwatch-ultra-x") return null;
  return {
    id: "prod_123",
    name: "Smartwatch Ultra X Pro - Monitoramento Cardíaco Avançado",
    description: "O Smartwatch mais completo do mercado. Monitoramento cardíaco, oxigenação do sangue, NFC para pagamentos e bateria que dura até 14 dias.",
    price: 197.90,
    compareAtPrice: 399.90,
    stockCount: 12,
    rating: 4.9,
    reviewsCount: 1284,
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800", alt: "Visão frontal" },
      { id: "img2", url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800", alt: "Visão lateral" },
      { id: "img3", url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800", alt: "Pulseira" },
    ]
  };
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) return { title: "Produto não encontrado" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.images[0].url],
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full bg-background min-h-screen pb-24 lg:pb-12">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-xs text-muted">
        Início {'>'} Tecnologia {'>'} <span className="text-white">{product.name}</span>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Lado Esquerdo: Galeria Premium */}
          <div className="w-full lg:sticky lg:top-24 self-start">
            <ProductGallery images={product.images} />
          </div>

          {/* Lado Direito: Informações e Conversão */}
          <div className="flex flex-col gap-6">
            {/* Título e Avaliações */}
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-blue text-brand-blue" />
                  ))}
                  <span className="text-white font-medium ml-2">{product.rating}</span>
                </div>
                <div className="text-sm text-muted">({product.reviewsCount} avaliações)</div>
                <div className="flex items-center gap-1 text-sm text-brand-green">
                  <CheckCircle className="w-4 h-4" /> 10k+ vendidos
                </div>
              </div>
            </div>

            {/* Ações (Preço, Botões, Escassez) */}
            <ProductActions 
              id={product.id}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              stockCount={product.stockCount}
            />

            {/* Descrição Rica */}
            <div className="mt-8 pt-8 border-t border-border/50">
              <h3 className="text-xl font-semibold text-white mb-4">Sobre o Produto</h3>
              <p className="text-muted leading-relaxed">
                {product.description}
              </p>
              
              {/* Feature List (SEO e CRO) */}
              <ul className="mt-6 space-y-3 text-sm text-muted">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-purple" />
                  Compatível com iOS e Android
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-purple" />
                  À prova d'água (IP68)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-purple" />
                  Recebe e faz chamadas via Bluetooth
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Buy Button (Apenas Mobile) - Técnica agressiva de CRO */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/90 backdrop-blur-xl border-t border-border/50 lg:hidden transform translate-y-0 transition-transform duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button className="w-full h-14 bg-gradient-premium text-white rounded-xl font-bold text-lg shadow-neon-purple flex items-center justify-center animate-pulse-slow">
          COMPRAR AGORA
        </button>
      </div>
    </div>
  );
}