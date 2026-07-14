"use client";

import * as React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

const data = [
  { name: "01/Jul", receita: 4000, custo: 1800 },
  { name: "05/Jul", receita: 5500, custo: 2100 },
  { name: "10/Jul", receita: 3200, custo: 1500 },
  { name: "15/Jul", receita: 8900, custo: 3800 }, // Pico de Ads
  { name: "20/Jul", receita: 7400, custo: 3100 },
  { name: "25/Jul", receita: 10500, custo: 4200 },
  { name: "30/Jul", receita: 9200, custo: 3900 },
];

export function RevenueChart() {
  return (
    <Card className="bg-card/40 border-border/40 w-full h-full">
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          Visão Geral de Receita
          <select className="bg-background border border-border text-xs text-muted rounded p-1 outline-none">
            <option>Últimos 30 dias</option>
            <option>Este Ano</option>
          </select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCusto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF2E63" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF2E63" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `R$${value / 1000}k`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0D0D0D", borderColor: "#1F1F1F", borderRadius: "8px" }}
                itemStyle={{ color: "#FFFFFF" }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Area 
                type="monotone" 
                dataKey="receita" 
                name="Receita"
                stroke="#00D4FF" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorReceita)" 
              />
              <Area 
                type="monotone" 
                dataKey="custo" 
                name="Custo Operacional"
                stroke="#FF2E63" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCusto)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}