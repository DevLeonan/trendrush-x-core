"use client";

import * as React from "react";
import { ProductCard } from "@/components/store/product/product-card";
import { Timer } from "lucide-react";

// Mock de produtos (Na Etapa 17 conectaremos com Prisma/Banco de Dados)
const VIRAL_PRODUCTS = [
  {
    id: "1",
    slug: "smartwatch-ultra-x",
    name: "Smartwatch Ultra X Pro - Monitoramento Cardíaco Avançado",
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800",
    price: 197.90,
    compareAtPrice: 399.90,
    rating: 4.9,
    reviewsCount: 1284,
    isViral: true,
  },
  {
    id: "2",
    slug: "fone-bluetooth-invisivel",
    name: "EarBuds Ghost - Fone Bluetooth Invisível Anti-Ruído",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800",
    price: 147.00,
    compareAtPrice: 289.00,
    rating: 4.8,
    reviewsCount: 856,
    isViral: true,
  },
  {
    id: "3",
    slug: "projetor-galaxia-360",
    name: "Projetor Astronauta Galáxia 360° - Laser Premium",
    imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800",
    price: 129.90,
    compareAtPrice: 249.90,
    rating: 5.0,
    reviewsCount: 3412,
    isViral: true,
  },
  {
    id: "4",
    slug: "mini-impressora-termica",
    name: "Mini Impressora Térmica Portátil Bluetooth 5.0",
    imageUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800",
    price: 97.50,
    compareAtPrice: 159.90,
    rating: 4.7,
    reviewsCount: 632,
    isViral: false,
  }
];

export function ViralSection() {
  return (
    <section className="py-24 relative bg-background">
      <div className="container mx-auto px-4">
        {/* Header da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
              PRODUTOS <span className="text-gradient">VIRAIS</span>
            </h2>
            <p className="text-muted text-lg max-w-xl">
              Os itens mais comentados do TikTok. Estoque limitadíssimo, garantidos com fornecedores homologados.
            </p>
          </div>

          {/* Countdown de Urgência */}
          <div className="flex items-center gap-3 bg-brand-red/10 border border-brand-red/20 px-4 py-3 rounded-xl">
            <Timer className="w-5 h-5 text-brand-red" />
            <div className="flex flex-col">
              <span className="text-xs text-brand-red font-bold uppercase tracking-wider">Oferta expira em:</span>
              <span className="text-white font-mono font-bold text-lg">04:12:59</span>
            </div>
          </div>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VIRAL_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}