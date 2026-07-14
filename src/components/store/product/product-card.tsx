"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Zap } from "lucide-react";
import { formatCurrency, calculateDiscountPercentage } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewsCount: number;
  isViral?: boolean;
}

export function ProductCard({
  slug,
  name,
  imageUrl,
  price,
  compareAtPrice,
  rating,
  reviewsCount,
  isViral,
}: ProductCardProps) {
  const discount = compareAtPrice ? calculateDiscountPercentage(price, compareAtPrice) : 0;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative flex flex-col bg-card/40 border border-border/50 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-neon-blue hover:border-brand-blue/50"
    >
      {/* Badges Flutuantes */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <Badge variant="destructive" className="animate-pulse-slow">
            {discount}% OFF
          </Badge>
        )}
        {isViral && (
          <Badge variant="premium" className="flex items-center gap-1 shadow-glass">
            <Zap className="w-3 h-3 text-yellow-300" /> Viral
          </Badge>
        )}
      </div>

      {/* Imagem do Produto */}
      <Link href={`/product/${slug}`} className="relative aspect-square w-full overflow-hidden bg-white/5">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay Glass no Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Informações */}
      <div className="flex flex-col flex-1 p-5">
        {/* Avaliações */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-brand-blue text-brand-blue" />
          <span className="text-sm font-semibold text-white">{rating.toFixed(1)}</span>
          <span className="text-xs text-muted">({reviewsCount})</span>
        </div>

        {/* Título */}
        <Link href={`/product/${slug}`}>
          <h3 className="text-base font-medium text-white line-clamp-2 hover:text-brand-blue transition-colors mb-3">
            {name}
          </h3>
        </Link>

        <div className="mt-auto">
          {/* Preços */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-premium">
              {formatCurrency(price)}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-sm text-muted line-through decoration-brand-red/50">
                {formatCurrency(compareAtPrice)}
              </span>
            )}
          </div>

          {/* Botão de Compra Rápida */}
          <Button className="w-full group/btn relative overflow-hidden bg-white/5 hover:bg-brand-blue text-white border border-white/10 hover:border-brand-blue transition-all duration-300">
            <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
              <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
              Comprar Agora
            </span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}