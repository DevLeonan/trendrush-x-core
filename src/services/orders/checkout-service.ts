import { prisma } from "@/lib/prisma/client";
import { orderRepository } from "@/repositories/order-repository";
import { type ApiCheckoutPayload } from "@/validations/api-checkout-schema";
import { logger } from "@/lib/logger";

export class CheckoutService {
  async process(payload: ApiCheckoutPayload) {
    try {
      logger.info({ message: "Iniciando processamento de checkout seguro", context: { email: payload.customer.email } });

      // 1. Busca os preços reais e custo no banco de dados
      const variantIds = payload.items.map((i) => i.variantId);
      const variants = await prisma.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: true },
      });

      let subtotal = 0;
      let supplierTotalCost = 0;

      // 2. Validação de Estoque e Cálculo de Totais
      const orderItems = payload.items.map((cartItem) => {
        const variant = variants.find((v) => v.id === cartItem.variantId);
        
        if (!variant) {
          throw new Error(`Produto/Variante inválida ou não encontrada.`);
        }
        
        // Em um sistema Dropshipping, o estoque pode ser "infinito", mas mantemos a trava
        if (variant.inventory < cartItem.quantity && variant.inventory !== -1) {
          throw new Error(`Estoque insuficiente para o item: ${variant.name}`);
        }

        const unitPrice = Number(variant.price);
        const supplierCost = Number(variant.product.costPrice);
        const totalPrice = unitPrice * cartItem.quantity;

        subtotal += totalPrice;
        supplierTotalCost += supplierCost * cartItem.quantity;

        return {
          variantId: variant.id,
          quantity: cartItem.quantity,
          unitPrice,
          totalPrice,
          supplierCost,
        };
      });

      // 3. Regras Financeiras e Descontos Oficiais (Backend)
      const discountAmount = payload.customer.paymentMethod === "PIX" ? subtotal * 0.05 : 0;
      const totalAmount = subtotal - discountAmount;
      const shippingCost = 0; // Configurado globalmente como Frete Grátis na Home

      // 4. Salva no Banco de Dados
      const order = await orderRepository.createCompleteOrder({
        customer: {
          email: payload.customer.email,
          name: payload.customer.name,
          document: payload.customer.document,
          phone: payload.customer.phone,
        },
        address: {
          street: payload.customer.street,
          number: payload.customer.number,
          complement: payload.customer.complement,
          neighborhood: payload.customer.neighborhood,
          city: payload.customer.city,
          state: payload.customer.state,
          zipCode: payload.customer.zipCode,
          country: "BR",
        },
        items: orderItems,
        payment: {
          method: payload.customer.paymentMethod,
          installments: 1, // Será injetado dinamicamente caso seja cartão
        },
        financials: {
          subtotal,
          shippingCost,
          discountAmount,
          totalAmount,
        },
      });

      // TODO: Na Etapa 18, integraremos com a SDK do Mercado Pago aqui para gerar PIX ou Token de Cartão
      
      logger.info({ message: "Checkout finalizado com sucesso no BD", context: { orderId: order.id } });

      return {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount,
      };

    } catch (error) {
      logger.error({ message: "Erro crítico no Checkout Service", error });
      throw error;
    }
  }
}

export const checkoutService = new CheckoutService();