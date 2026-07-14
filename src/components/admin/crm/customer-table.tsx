"use client";

import * as React from "react";
import { Search, Download, Star, AlertTriangle, UserPlus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import type { CustomerSegment } from "@/services/users/crm-service";

interface CustomerTableProps {
  initialData: CustomerSegment[];
}

export function CustomerTable({ initialData }: CustomerTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterSegment, setFilterSegment] = React.useState<string>("TODOS");

  // Filtro puramente no client-side para resposta instantânea
  const filteredCustomers = React.useMemo(() => {
    return initialData.filter((customer) => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSegment = filterSegment === "TODOS" || customer.segment === filterSegment;
      
      return matchesSearch && matchesSegment;
    });
  }, [initialData, searchTerm, filterSegment]);

  const getSegmentBadge = (segment: CustomerSegment["segment"]) => {
    switch (segment) {
      case "VIP": 
        return <Badge variant="premium" className="flex items-center gap-1"><Star className="w-3 h-3" /> VIP</Badge>;
      case "RISCO_CHURN": 
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Risco de Churn</Badge>;
      case "NOVO": 
        return <Badge variant="default" className="flex items-center gap-1 bg-brand-blue text-white"><UserPlus className="w-3 h-3" /> Novo</Badge>;
      case "REGULAR": 
        return <Badge variant="outline" className="flex items-center gap-1"><Users className="w-3 h-3" /> Regular</Badge>;
    }
  };

  const handleExportCSV = () => {
    // Lógica futura para exportar LTV para o Facebook Ads (Value-Based Lookalike)
    console.log("Exportando dados para CSV...", filteredCustomers.length, "contatos.");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de Ferramentas CRM */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-card/30 p-4 rounded-xl border border-border/50">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input 
            placeholder="Buscar por nome ou e-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={filterSegment}
            onChange={(e) => setFilterSegment(e.target.value)}
            className="h-12 px-4 rounded-lg bg-background border border-border text-sm text-white outline-none focus:ring-1 focus:ring-brand-blue"
          >
            <option value="TODOS">Todos os Segmentos</option>
            <option value="VIP">Clientes VIP</option>
            <option value="REGULAR">Regulares</option>
            <option value="NOVO">Novos Clientes</option>
            <option value="RISCO_CHURN">Risco de Churn</option>
          </select>
          
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar Audiência
          </Button>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-card/40 border border-border/40 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted uppercase bg-card/60 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-bold">Cliente</th>
                <th className="px-6 py-4 font-bold">Segmento</th>
                <th className="px-6 py-4 font-bold text-center">Pedidos</th>
                <th className="px-6 py-4 font-bold">LTV (Gasto Total)</th>
                <th className="px-6 py-4 font-bold">Última Compra</th>
                <th className="px-6 py-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted">
                    Nenhum cliente encontrado para estes filtros.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-card/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{customer.name}</span>
                        <span className="text-xs text-muted">{customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getSegmentBadge(customer.segment)}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-white">
                      {customer.totalOrders}
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-green">
                      {formatCurrency(customer.ltv)}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {customer.lastOrderDate 
                        ? new Date(customer.lastOrderDate).toLocaleDateString("pt-BR")
                        : "Nenhuma"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-brand-blue hover:text-brand-blue/80">
                        Ver Perfil
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}