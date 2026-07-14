import * as React from "react";
import { MetricsCards } from "@/components/admin/dashboard/metrics-cards";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";

// Mock para os pedidos recentes
const RECENT_ORDERS = [
  { id: "TR-123456", customer: "João Silva", amount: 197.90, status: "APPROVED", date: "Há 5 min" },
  { id: "TR-123457", customer: "Maria Oliveira", amount: 349.00, status: "PENDING", date: "Há 12 min" },
  { id: "TR-123458", customer: "Carlos Eduardo", amount: 97.50, status: "SHIPPED", date: "Há 1 hora" },
  { id: "TR-123459", customer: "Ana Costa", amount: 129.90, status: "APPROVED", date: "Há 2 horas" },
  { id: "TR-123460", customer: "Lucas Moura", amount: 450.00, status: "CHARGEBACK", date: "Há 5 horas" },
];

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "APPROVED": return <Badge variant="success">Aprovado</Badge>;
    case "PENDING": return <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">Aguardando PIX</Badge>;
    case "SHIPPED": return <Badge variant="default">Enviado (CJ)</Badge>;
    case "CHARGEBACK": return <Badge variant="destructive">Chargeback</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white">Visão Geral</h1>
        <p className="text-sm text-muted mt-1">Acompanhe as métricas de conversão e logística da loja.</p>
      </div>

      <MetricsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Ocupa 2 Colunas */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Últimos Pedidos Ocupa 1 Coluna */}
        <Card className="bg-card/40 border-border/40 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Últimos Pedidos</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-6">
              {RECENT_ORDERS.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-white">{order.id}</span>
                    <span className="text-xs text-muted">{order.customer} • {order.date}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-premium">
                      {formatCurrency(order.amount)}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 text-sm text-brand-blue font-medium hover:underline">
              Ver todos os pedidos &rarr;
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}