"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock } from "lucide-react";
import { CheckoutForm } from "@/components/store/checkout/checkout-form";
import { useCartStore } from "@/store/use-cart-store";
import { formatCurrency } from "@/utils/formatters";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal } = useCartStore();
  const [mounted, setMounted] = React.useState(false);

  const subtotal = getSubtotal();
  const pixDiscount = subtotal * 0.05;

  // Previne Hydration Mismatch garantindo que o Zustand carregou no cliente
  React.useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push("/");
    }
  }, [items, router]);

  if (!mounted || items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Simplificado para Checkout (Sem distração) */}
      <header className="w-full border-b border-border/50 bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter text-white">
            TREND<span className="text-gradient">RUSH</span> X
          </Link>
          <div className="flex items-center gap-2 text-xs text-brand-green font-medium">
            <Lock className="w-4 h-4" /> Checkout Seguro
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Lado Esquerdo: Formulário de Checkout */}
          <div className="lg:col-span-7 xl:col-span-8">
            <CheckoutForm />
          </div>

          {/* Lado Direito: Resumo do Pedido (Sticky) */}
          <div className="lg:col-span-5 xl:col-span-4 relative">
            <div className="sticky top-24 bg-card/40 border border-border/50 rounded-2xl p-6 backdrop-blur-md shadow-glass">
              <h3 className="text-lg font-bold text-white mb-6">Resumo do Pedido</h3>
              
              {/* Lista de Itens */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden border border-border/30 flex-shrink-0">
                      <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
                      <div className="absolute -top-2 -right-2 bg-brand-blue text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h4 className="text-xs font-medium text-white line-clamp-2">{item.name}</h4>
                      <span className="text-sm font-bold text-brand-blue mt-1">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totais */}
              <div className="border-t border-border/50 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Frete</span>
                  <span className="text-brand-green font-medium">Grátis</span>
                </div>
                <div className="flex justify-between text-brand-green">
                  <span>Desconto PIX</span>
                  <span>- {formatCurrency(pixDiscount)}</span>
                </div>
                
                <div className="border-t border-border/50 pt-3 flex flex-col">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-white font-medium">Total no PIX</span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-premium">
                      {formatCurrency(subtotal - pixDiscount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted">
                    <span>Total no Cartão</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Section */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <div className="flex items-center gap-3 text-xs text-muted mb-4">
                  <ShieldCheck className="w-8 h-8 text-brand-green flex-shrink-0" />
                  <p>
                    Compra processada em ambiente <strong>100% seguro e criptografado</strong>. 
                    Seus dados bancários não são armazenados em nossos servidores.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}