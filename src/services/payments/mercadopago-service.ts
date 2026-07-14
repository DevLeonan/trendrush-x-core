import { mpPayment } from "@/lib/mercadopago/client";
import { prisma } from "@/lib/prisma/client";
import { PaymentStatus, OrderStatus } from "@prisma/client";
import { logger } from "@/lib/logger";

interface CreatePixPayload {
  orderId: string;
  orderNumber: string;
  amount: number;
  customer: {
    email: string;
    name: string;
    document: string;
  };
}

export class MercadoPagoService {
  /**
   * Gera uma cobrança PIX dinâmica atrelada ao pedido.
   */
  async createPixPayment(payload: CreatePixPayload) {
    try {
      // O nome completo precisa ser separado em First e Last Name para a API do MP
      const nameParts = payload.customer.name.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "Cliente";

      const paymentResponse = await mpPayment.create({
        body: {
          transaction_amount: payload.amount,
          description: `Pedido ${payload.orderNumber} - TRENDRUSH X`,
          payment_method_id: "pix",
          payer: {
            email: payload.customer.email,
            first_name: firstName,
            last_name: lastName,
            identification: {
              type: payload.customer.document.length > 14 ? "CNPJ" : "CPF",
              number: payload.customer.document.replace(/\D/g, ""), // Apenas números
            },
          },
          external_reference: payload.orderId,
        },
        requestOptions: {
          idempotencyKey: payload.orderId, // Evita dupla cobrança em caso de retry
        },
      });

      const qrCode = paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64;
      const copyPaste = paymentResponse.point_of_interaction?.transaction_data?.qr_code;

      if (!qrCode || !copyPaste) {
        throw new Error("Mercado Pago não retornou os dados do PIX.");
      }

      // Atualiza o pedido no banco com os dados do PIX e ID do Mercado Pago
      await prisma.order.update({
        where: { id: payload.orderId },
        data: {
          mercadoPagoId: paymentResponse.id?.toString(),
          pixQrCode: qrCode,
          pixCopyPaste: copyPaste,
        },
      });

      return {
        qrCodeBase64: qrCode,
        copyPaste: copyPaste,
        paymentId: paymentResponse.id,
      };
    } catch (error) {
      logger.error({ message: "Falha ao gerar PIX no Mercado Pago", error, context: { orderId: payload.orderId } });
      throw new Error("Não foi possível gerar o pagamento no momento.");
    }
  }

  /**
   * Processa o Webhook recebido, busca o status real na API e atualiza o banco.
   * Totalmente protegido contra fraudes (Server-to-Server).
   */
  async processWebhook(paymentId: string) {
    try {
      // 1. Busca os dados reais do pagamento direto na API do Mercado Pago
      const payment = await mpPayment.get({ id: paymentId });

      if (!payment || !payment.external_reference) {
        throw new Error("Pagamento não encontrado ou sem referência externa.");
      }

      const orderId = payment.external_reference;
      const status = payment.status;

      let newPaymentStatus: PaymentStatus = PaymentStatus.AWAITING_PAYMENT;
      let newOrderStatus: OrderStatus = OrderStatus.PENDING;

      // 2. Mapeia o status do MP para o nosso schema
      switch (status) {
        case "approved":
          newPaymentStatus = PaymentStatus.APPROVED;
          newOrderStatus = OrderStatus.PROCESSING; // Vai para processamento (Pronto para Automação CJ)
          break;
        case "rejected":
          newPaymentStatus = PaymentStatus.REJECTED;
          newOrderStatus = OrderStatus.CANCELED;
          break;
        case "refunded":
          newPaymentStatus = PaymentStatus.REFUNDED;
          newOrderStatus = OrderStatus.REFUNDED;
          break;
        case "charged_back":
          newPaymentStatus = PaymentStatus.CHARGEBACK;
          newOrderStatus = OrderStatus.CANCELED;
          break;
        case "in_process":
          newPaymentStatus = PaymentStatus.IN_PROCESS;
          break;
      }

      // 3. Atualiza o banco de dados
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: newPaymentStatus,
          status: newPaymentStatus === PaymentStatus.APPROVED ? newOrderStatus : undefined,
        },
      });

      logger.info({ 
        message: `Webhook Processado - Pedido ${updatedOrder.orderNumber} atualizado para ${newPaymentStatus}`, 
        context: { paymentId, status } 
      });

      return updatedOrder;
    } catch (error) {
      logger.error({ message: "Falha ao processar Webhook do Mercado Pago", error, context: { paymentId } });
      throw error;
    }
  }
}

export const mercadoPagoService = new MercadoPagoService();