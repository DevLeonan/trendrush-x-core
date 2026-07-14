"use client";

import * as React from "react";
import { DollarSign, TrendingUp, ShoppingBag, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

// Dados mockados para construção da UI. Na Etapa 21 (Analytics), buscaremos do banco.
const METRICS = [
  {
    title: "Receita Total (Mês)",
    value: 124500.90,
    isCurrency: true,
    trend: "+15.2%",
    isPositive: true,
    icon: DollarSign,
    color: "text-brand-green",
    bg: "bg-brand-green/10",
  },
  {
    title: "Lucro Líquido Est.",
    value: 48200.00,
    isCurrency: true,
    trend: "+8.4%",
    isPositive: true,
    icon: TrendingUp,
    color: "text-brand-blue",
    bg: "bg-brand-blue/10",
  },
  {
    title: "Pedidos Fechados",
    value: 842,
    isCurrency: false,
    trend: "+12.1%",
    isPositive: true,
    icon: ShoppingBag,
    color: "text-brand-purple",
    bg: "bg-brand-purple/10",
  },
  {
    title: "Taxa de Conversão",
    value: 3.2,
    isCurrency: false,
    suffix: "%",
    trend: "-0.4%",
    isPositive: false,
    icon: Activity,
    color: "text-brand-red",
    bg: "bg-brand-red/10",
  },
];

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {METRICS.map((metric) => {
        const Icon = metric.icon;
        
        return (
          <Card key={metric.title} className="bg-card/40 border-border/40 hover:border-border/80 transition-colors">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted">{metric.title}</span>
                <div className={`p-2 rounded-lg ${metric.bg}`}>
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
              </div>
              
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-white tracking-tight">
                  {metric.isCurrency ? formatCurrency(metric.value) : metric.value}
                  {metric.suffix && <span className="text-lg ml-1">{metric.suffix}</span>}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium">
                <span className={metric.isPositive ? "text-brand-green" : "text-brand-red"}>
                  {metric.trend}
                </span>
                <span className="text-muted opacity-60">vs. mês passado</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}