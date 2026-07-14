import * as React from "react";
import { Users } from "lucide-react";
import { crmService } from "@/services/users/crm-service";
import { CustomerTable } from "@/components/admin/crm/customer-table";

// Server Component: Busca os dados de forma segura direto do banco de dados na hora do carregamento
export default async function CrmPage() {
  const customers = await crmService.getCustomersList();

  const totalCustomers = customers.length;
  const vipCount = customers.filter(c => c.segment === "VIP").length;
  const churnRiskCount = customers.filter(c => c.segment === "RISCO_CHURN").length;

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      {/* Header da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-blue" /> CRM & Clientes
          </h1>
          <p className="text-sm text-muted mt-1">
            Gerencie sua base de contatos, identifique compradores fiéis e recupere clientes inativos.
          </p>
        </div>
      </div>

      {/* Mini-Cards de Inteligência */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card/40 border border-border/50 p-6 rounded-xl border-l-4 border-l-brand-blue">
          <p className="text-sm font-medium text-muted mb-1">Total de Clientes Base</p>
          <h3 className="text-3xl font-black text-white">{totalCustomers}</h3>
        </div>
        <div className="bg-card/40 border border-border/50 p-6 rounded-xl border-l-4 border-l-brand-purple">
          <p className="text-sm font-medium text-muted mb-1">Clientes VIP (Alto Valor)</p>
          <h3 className="text-3xl font-black text-brand-purple">{vipCount}</h3>
        </div>
        <div className="bg-card/40 border border-border/50 p-6 rounded-xl border-l-4 border-l-brand-red">
          <p className="text-sm font-medium text-muted mb-1">Risco de Churn (Inativos)</p>
          <h3 className="text-3xl font-black text-brand-red">{churnRiskCount}</h3>
        </div>
      </div>

      {/* Componente Interativo de Tabela (Client Component) */}
      <CustomerTable initialData={customers} />
    </div>
  );
}