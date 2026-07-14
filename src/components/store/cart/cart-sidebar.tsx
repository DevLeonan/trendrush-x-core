"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ShieldCheck, ArrowRight, Truck } from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { CartItem } from "./cart-item";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";

// Valor em reais para atingir o frete grátis
const FREE_SHIPPING_THRESHOLD = 299; 

export function CartSidebar() {
  const router = useRouter();
  const { items, isOpen, closeCart, getSubtotal, getTotalItems } = useCartStore();

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const pixDiscount = subtotal * 0.05; // 5% PIX
  const totalPix = subtotal - pixDiscount;

  // Lógica da Barra de Frete Grátis
  const progressPercentage = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  // Bloqueia o scroll da página quando o carrinho estiver aberto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Escuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Painel Lateral */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[70] h-full w-full sm:w-[400px] bg-background border-l border-border/50 shadow-2xl flex flex-col"
          >
            {/* Header do Carrinho */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/20">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-blue" />
                <h2 className="text-lg font-bold text-white">Seu Carrinho</h2>
                <span className="bg-brand-blue/20 text-brand-blue text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button 
                onClick={closeCart}
                className="p-2 bg-card rounded-full text-muted hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progresso de Frete Grátis (Gatilho de Ticket Médio) */}
            <div className="p-4 bg-card/10 border-b border-border/30">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-1 font-medium text-white">
                  <Truck className="w-4 h-4 text-brand-blue" />
                  {remainingForFreeShipping > 0 
                    ? `Faltam ${formatCurrency(remainingForFreeShipping)} para` 
                    : "Você ganhou"}
                  <span className="text-brand-blue font-bold">Frete Grátis</span>
                </div>
              </div>
              <div className="w-full h-2 bg-card rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    progressPercentage === 100 
                      ? "bg-brand-green shadow-[0_0_10px_rgba(0,255,153,0.5)]" 
                      : "bg-gradient-to-r from-brand-blue to-brand-purple"
                  }`}
                />
              </div>
            </div>

            {/* Lista de Itens ou Estado Vazio */}
            <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 opacity-50">
                  <ShoppingBag className="w-16 h-16 text-muted" />
                  <p className="text-white text-lg font-medium">Seu carrinho está vazio</p>
                  <Button onClick={closeCart} variant="outline" className="mt-4">
                    Continuar Comprando
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Resumo do Pedido (Fixado na base) */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-md flex flex-col gap-4">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-brand-green font-medium">
                    <span>Desconto PIX (5%)</span>
                    <span>- {formatCurrency(pixDiscount)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg mt-2 pt-2 border-t border-border/50">
                    <span>Total no PIX</span>
                    <span className="text-transparent bg-clip-text bg-gradient-premium">
                      {formatCurrency(totalPix)}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  size="lg" 
                  variant="premium" 
                  className="w-full h-14 text-base font-bold shadow-neon-purple flex justify-between px-6"
                >
                  FINALIZAR COMPRA
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted mt-2">
                  <ShieldCheck className="w-4 h-4 text-brand-green" />
                  Ambiente Seguro e Criptografado
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}