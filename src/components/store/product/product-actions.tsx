"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Zap, Eye, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, calculateDiscountPercentage } from "@/utils/formatters";

interface ProductActionsProps {
  id: string;
  price: number;
  compareAtPrice: number;
  stockCount: number;
}

export function ProductActions({ id, price, compareAtPrice, stockCount }: ProductActionsProps) {
  // Hooks para gatilhos de conversão dinâmicos
  const [viewers, setViewers] = React.useState(124);
  const discount = calculateDiscountPercentage(price, compareAtPrice);
  const pixPrice = price * 0.95; // 5% de desconto no PIX

  React.useEffect(() => {
    // Simula variação realista de visitantes online
    const interval = setInterval(() => {
      setViewers((prev) => Math.floor(Math.random() * (150 - 90 + 1)) + 90);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = () => {
    // Lógica Zustand será injetada aqui na etapa 15
    console.log("Adicionado ao carrinho:", id);
  };

  const handleBuyNow = () => {
    // Redireciona direto para o checkout expresso
    console.log("Redirecionando para checkout expresso:", id);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Gatilho: Visitantes Online */}
      <div className="flex items-center gap-2 text-sm text-brand-red font-medium animate-pulse-slow">
        <Eye className="w-4 h-4" />
        <span>{viewers} pessoas estão olhando este produto agora</span>
      </div>

      {/* Bloco de Preço */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="text-muted line-through text-lg">
            {formatCurrency(compareAtPrice)}
          </span>
          <span className="bg-brand-red text-white text-xs font-bold px-2 py-1 rounded-md">
            ECONOMIZE {discount}%
          </span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-premium leading-none">
            {formatCurrency(price)}
          </span>
        </div>
        <p className="text-sm text-muted mt-2">
          ou <span className="text-brand-green font-bold">{formatCurrency(pixPrice)}</span> no PIX (5% OFF)
          <br />
          em até 12x de {formatCurrency(price / 12)} no cartão
        </p>
      </div>

      {/* Gatilho: Estoque Baixo */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-brand-red flex items-center gap-1">
            <Zap className="w-4 h-4" /> Corra! Estoque acabando.
          </span>
          <span className="text-muted">Apenas {stockCount} unidades</span>
        </div>
        <div className="w-full h-2 bg-card rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: "15%" }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-brand-red to-orange-500 rounded-full"
          />
        </div>
      </div>

      {/* Ações Primárias */}
      <div className="flex flex-col gap-3 mt-4">
        <Button 
          onClick={handleBuyNow} 
          size="lg" 
          variant="premium" 
          className="w-full text-lg h-14 shadow-neon-purple animate-pulse-slow"
        >
          COMPRAR AGORA
        </Button>
        <Button 
          onClick={handleAddToCart} 
          size="lg" 
          variant="outline" 
          className="w-full h-14 border-brand-blue/50 text-brand-blue hover:bg-brand-blue/10"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 mt-6 p-4 bg-card/30 border border-border/50 rounded-xl">
        <div className="flex flex-col items-center text-center gap-1">
          <Truck className="w-5 h-5 text-brand-blue" />
          <span className="text-[10px] text-muted uppercase">Frete Grátis</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1">
          <ShieldCheck className="w-5 h-5 text-brand-green" />
          <span className="text-[10px] text-muted uppercase">Compra Segura</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1">
          <CreditCard className="w-5 h-5 text-brand-purple" />
          <span className="text-[10px] text-muted uppercase">Até 12x</span>
        </div>
      </div>
    </div>
  );
}