"use client";

import * as React from "react";
import { Search, Bell, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AdminHeader() {
  return (
    <header className="h-20 w-full bg-background/80 border-b border-border/50 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input 
            placeholder="Buscar pedido, cliente ou produto (Pressione '/')" 
            className="pl-10 bg-card/30 border-border/50 h-10 text-sm focus-visible:ring-brand-purple"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-red rounded-full border border-background"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-border/50 mx-2"></div>

        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-premium flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-bold text-white leading-none">Admin</span>
            <span className="text-[10px] text-brand-green font-medium">Online</span>
          </div>
        </button>
      </div>
    </header>
  );
}