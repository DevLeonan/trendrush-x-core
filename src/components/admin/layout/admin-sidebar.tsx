"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PackageSearch, 
  ShoppingCart, 
  Users, 
  LineChart, 
  Settings,
  Megaphone,
  Box
} from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Pedidos", href: "/admin/orders", icon: ShoppingCart },
  { name: "Produtos", href: "/admin/products", icon: Box },
  { name: "Importar CJ", href: "/admin/products/import", icon: PackageSearch },
  { name: "Clientes (CRM)", href: "/admin/crm", icon: Users },
  { name: "Financeiro", href: "/admin/finance", icon: LineChart },
  { name: "Marketing & Ads", href: "/admin/marketing", icon: Megaphone },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-card/50 border-r border-border/50 backdrop-blur-xl flex flex-col transition-all duration-300 hidden md:flex">
      <div className="h-20 flex items-center px-6 border-b border-border/50">
        <Link href="/admin/dashboard" className="text-xl font-black tracking-tighter text-white">
          TREND<span className="text-brand-blue">RUSH</span> <span className="text-xs text-muted font-medium ml-1">ADMIN</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 hide-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-[0_0_15px_rgba(0,212,255,0.1)]" 
                  : "text-muted hover:bg-card hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-brand-blue" : "text-muted")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-card hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          Configurações
        </Link>
      </div>
    </aside>
  );
}