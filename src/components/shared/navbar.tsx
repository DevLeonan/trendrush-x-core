"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  // Em uma etapa futura, este estado virá do Zustand (Store de Carrinho)
  const cartItemsCount = 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-premium shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 -ml-2 text-muted hover:text-white transition-colors">
            <Menu className="h-6 w-6" />
          </button>
          
          <Link href="/" className="flex items-center gap-2 group relative z-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-black tracking-tighter text-white flex items-center gap-1"
            >
              TREND<span className="text-gradient">RUSH</span> X
            </motion.div>
          </Link>
        </div>

        {/* Desktop Search (Otimizado para CRO - Sempre visível) */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted group-focus-within:text-brand-blue transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Busque por produtos virais..."
              className="w-full h-12 bg-card/50 border border-border rounded-full pl-12 pr-4 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all backdrop-blur-md"
            />
          </div>
        </div>

        {/* Actions (Account & Cart) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden sm:flex items-center gap-2 p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-card">
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">Entrar</span>
          </button>
          
          <button className="relative p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-card flex items-center gap-2 group">
            <div className="relative">
              <ShoppingBag className="h-6 w-6 group-hover:scale-110 transition-transform" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white shadow-[0_0_10px_rgba(255,46,99,0.5)]">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium">Carrinho</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Search Bar (Aparece abaixo da Navbar no mobile) */}
      <div className="lg:hidden border-t border-border/30 p-3 bg-background/90 backdrop-blur-md">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="O que você procura?"
            className="w-full h-10 bg-card border border-border rounded-full pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
      </div>
    </header>
  );
}