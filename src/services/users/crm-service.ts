import { prisma } from "@/lib/prisma/client";
import { OrderStatus } from "@prisma/client";
import { logger } from "@/lib/logger";

export interface CustomerSegment {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  totalOrders: number;
  ltv: number;
  lastOrderDate: Date | null;
  segment: "VIP" | "REGULAR" | "NOVO" | "RISCO_CHURN";
}

export class CrmService {
  /**
   * Avalia dinamicamente a segmentação do cliente com base no seu histórico.
   */
  private calculateSegment(totalOrders: number, ltv: number, lastOrderDate: Date | null): CustomerSegment["segment"] {
    if (totalOrders === 0) return "NOVO";
    
    // Se gastou mais de R$ 1000 ou comprou mais de 3 vezes = VIP
    if (ltv >= 1000 || totalOrders >= 3) return "VIP";

    // Se comprou mas faz mais de 60 dias = Risco de Churn (Inativo)
    if (lastOrderDate) {
      const daysSinceLastOrder = (new Date().getTime() - lastOrderDate.getTime()) / (1000 * 3600 * 24);
      if (daysSinceLastOrder > 60) return "RISCO_CHURN";
    }

    return "REGULAR";
  }

  /**
   * Retorna a lista de clientes enriquecida com dados financeiros e de segmentação.
   */
  async getCustomersList(): Promise<CustomerSegment[]> {
    try {
      const users = await prisma.user.findMany({
        where: { role: "CUSTOMER" },
        include: {
          orders: {
            where: {
              status: { in: [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED] }
            },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true, totalAmount: true }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      return users.map((user) => {
        const validOrders = user.orders;
        const totalOrders = validOrders.length;
        
        // Calcula o LTV real baseado apenas em pedidos pagos/enviados
        const ltv = validOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const lastOrderDate = validOrders.length > 0 ? validOrders[0].createdAt : null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          totalOrders,
          ltv,
          lastOrderDate,
          segment: this.calculateSegment(totalOrders, ltv, lastOrderDate)
        };
      });
    } catch (error) {
      logger.error({ message: "Falha ao processar lista de clientes no CRM", error });
      throw new Error("Erro ao carregar dados do CRM.");
    }
  }
}

export const crmService = new CrmService();