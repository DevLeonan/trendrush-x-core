"use client";

import * as React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, type CartItem as ICartItem } from "@/store/use-cart-store";
import { formatCurrency } from "@/utils/formatters";

interface CartItemProps {
  item: ICartItem;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b border-border/50">
      {/* Imagem do Produto */}
      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-card/50 flex-shrink-0 border border-border/30">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Detalhes */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-2">
          <div className="flex flex-col">
            <h4 className="text-sm font-medium text-white line-clamp-2 leading-tight">
              {item.name}
            </h4>
            {item.variant && (
              <span className="text-xs text-muted mt-1">Variante: {item.variant}</span>
            )}
          </div>
          <button 
            onClick={() => removeItem(item.id)}
            className="text-muted hover:text-brand-red transition-colors p-1"
            aria-label="Remover item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-end justify-between mt-2">
          {/* Controle de Quantidade */}
          <div className="flex items-center border border-border rounded-lg bg-card/30">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1.5 text-muted hover:text-white transition-colors"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1.5 text-muted hover:text-white transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Preço Total do Item */}
          <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-premium">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}