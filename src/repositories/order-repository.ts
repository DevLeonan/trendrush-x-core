import { prisma } from "@/lib/prisma/client";
import { PaymentMethod, PaymentStatus, OrderStatus, Prisma } from "@prisma/client";

export interface CreateOrderPayload {
  customer: {
    email: string;
    name: string;
    document: string;
    phone: string;
  };
  address: Prisma.InputJsonValue;
  items: Array<{
    variantId: string;
    quantity: number;
    unitPrice: Prisma.Decimal | number;
    totalPrice: Prisma.Decimal | number;
    supplierCost: Prisma.Decimal | number;
  }>;
  payment: {
    method: PaymentMethod;
    installments: number;
  };
  financials: {
    subtotal: Prisma.Decimal | number;
    shippingCost: Prisma.Decimal | number;
    discountAmount: Prisma.Decimal | number;
    totalAmount: Prisma.Decimal | number;
  };
}

export class OrderRepository {
  async createCompleteOrder(payload: CreateOrderPayload) {
    return await prisma.$transaction(async (tx) => {
      // 1. Upsert Usuário (Sistema de Guest Checkout Inteligente)
      const user = await tx.user.upsert({
        where: { email: payload.customer.email },
        update: {
          name: payload.customer.name,
          phone: payload.customer.phone,
          document: payload.customer.document,
        },
        create: {
          email: payload.customer.email,
          name: payload.customer.name,
          phone: payload.customer.phone,
          document: payload.customer.document,
        },
      });

      // 2. Geração de Número Único de Pedido
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const orderNumber = `TR-${timestamp}-${random}`;

      // 3. Criação do Pedido e Vínculo dos Itens
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          guestEmail: payload.customer.email,
          status: OrderStatus.PENDING,
          
          subtotal: payload.financials.subtotal,
          shippingCost: payload.financials.shippingCost,
          discountAmount: payload.financials.discountAmount,
          totalAmount: payload.financials.totalAmount,
          
          paymentMethod: payload.payment.method,
          paymentStatus: PaymentStatus.AWAITING_PAYMENT,
          installments: payload.payment.installments,
          shippingAddress: payload.address,
          
          items: {
            create: payload.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              supplierCost: item.supplierCost,
            })),
          },
        },
        include: {
          items: true,
          user: true,
        },
      });

      return order;
    });
  }
}

export const orderRepository = new OrderRepository();